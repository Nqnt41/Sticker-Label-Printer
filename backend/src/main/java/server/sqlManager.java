package server;

import java.sql.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class sqlManager {
    private static String URL = "";
    private static String USER = "";
    private static String PASSWORD = "";
    private static String TABLE = "";

    private static Connection connection = null;

    public static Connection establishConnection(String port, String dbName, String table, String user, String password) throws SQLException {
        if (connection != null && !connection.isClosed()) {
            return connection;
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            String url = "jdbc:mysql://" + port + "/" + dbName;

            boolean matchFound = false;
            if (Objects.equals(URL, "")) {
                System.out.println("Attempting to connect to database with the following information...");
                System.out.println("URL: " + url + ", Username: " + user + ", Password: " + password);
                connection = DriverManager.getConnection(url, user, password);
            }
            else {
                System.out.println("Attempting to connect to database with the following (saved) information...");
                System.out.println("URL: " + URL + ", Username: " + USER + ", Password: " + PASSWORD);
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
                matchFound = true;
            }
            System.out.println("Database connection established successfully.");

            Statement statement = connection.createStatement();

            statement.executeUpdate("CREATE DATABASE IF NOT EXISTS StickerPrinter");
            System.out.println("Database created successfully, if did not already exist.");

            PreparedStatement preparedStatement = connection.prepareStatement(
                "CREATE TABLE" + table + "(" +
                "id INT AUTO_INCREMENT PRIMARY KEY," +
                "name VARCHAR(50) NOT NULL," +
                "size INT," +
                "ingredients VARCHAR(250)," +
                "mark VARCHAR(50)," +
                "expiration DATE," +
                "useKimmys BOOLEAN DEFAULT TRUE," +
                "useAddress BOOLEAN DEFAULT TRUE," +
                "useNumber BOOLEAN DEFAULT TRUE," +
                "additionDate DATE" +
                ");"
            );
            preparedStatement.setString(1, table);
            System.out.println("Created table for sticker labels if did not already exist.");

            if (!matchFound) {
                URL = url;
                USER = user;
                PASSWORD = password;
                TABLE = table;
            }

            return connection;
        }
        catch (SQLException e) {
            System.err.println("establishConnection - Failed to establish database connection.");
            System.out.println("SQLException: " + e.getMessage());
            System.out.println("SQLState: " + e.getSQLState());
            System.out.println("VendorError: " + e.getErrorCode());

            return null;
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    private static void prepareStatement(Label data, PreparedStatement statement) throws SQLException, ParseException {
        statement.setString(1, data.getName());
        statement.setInt(2, data.getSize());
        statement.setString(3, data.getIngredients());
        statement.setString(4, data.getMark());

        SimpleDateFormat formatter = new SimpleDateFormat("M/d/yyyy");
        java.util.Date utilDate = formatter.parse(data.getExpiration());
        Date formattedDate = new Date(utilDate.getTime());
        statement.setDate(5, formattedDate);

        statement.setBoolean(6, data.getOptions()[0]);
        statement.setBoolean(7, data.getOptions()[1]);
        statement.setBoolean(8, data.getOptions()[2]);

        java.util.Date utilAdditionDate = formatter.parse(data.getAdditionDate());
        Date formattedAdditionDate = new Date(utilAdditionDate.getTime());
        statement.setDate(9, formattedAdditionDate);
    }

    public static void addDB(Label data) throws SQLException {
        if (connection == null || connection.isClosed()) {
            System.err.println("addDB - No connection to server!");
            return;
        }

        try {
            PreparedStatement statement = connection.prepareStatement(
                "INSERT INTO ? ( name, size, ingredients, mark, expiration, useKimmys, useAddress, useNumber, additionDate ) " +
                "VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? );"
            );
            prepareStatement(data, statement);

            int rowsAffected = statement.executeUpdate();
            System.out.println("addDB - Rows affected: " + rowsAffected);
        }
        catch (Exception e) {
            throw new RuntimeException("addDB - An error occurred adding to database", e);
        }
    }

    public static void setDB(int idNum, Label data) throws SQLException {
        if (connection == null || connection.isClosed()) {
            System.err.println("setDB - No connection to server!");
            return;
        }

        try {
            PreparedStatement statement = connection.prepareStatement(
                "UPDATE ?" +
                "SET (name = ?, size = ?, ingredients = ?, mark = ?, expiration = ?, useKimmys = ?, useAddress = ?, useNumber = ?, additionDate = ?)" +
                "WHERE id = ?;"
            );
            prepareStatement(data, statement);
            statement.setInt(11, idNum);

            int rowsAffected = statement.executeUpdate();
            System.out.println("setDB - Rows affected: " + rowsAffected);
        }
        catch (Exception e) {
            throw new RuntimeException("setDB - An error occurred adding to database", e);
        }
    }

    public static void clearDB() throws SQLException {
        if (connection == null || connection.isClosed()) {
            System.err.println("clearDB - No connection to server!");
            return;
        }

        try {
            PreparedStatement statement = connection.prepareStatement(
                    "DELETE FROM " + TABLE
            );

            int rowsAffected = statement.executeUpdate();
            System.out.println("clearDB - Rows affected: " + rowsAffected);
        } catch (Exception e) {
            throw new RuntimeException("removeFromDB - An error occurred adding to database", e);
        }
    }

    public static List<Label> fetchDataDB() throws SQLException {
        if (connection == null || connection.isClosed()) {
            System.err.println("setDB - No connection to server!");
            return new ArrayList<>();
        }

        List<Label> data = new ArrayList<>();
        try (Statement statement = connection.createStatement();
            ResultSet result = statement.executeQuery("SELECT * FROM " + TABLE)) {

            while (result.next()) {
                java.sql.Date expirationDate = result.getDate("expiration");
                String expirationString = expirationDate != null ? expirationDate.toLocalDate().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")) : "";

                java.sql.Date additionDate = result.getDate("additionDate");
                String additionString = additionDate != null ? additionDate.toLocalDate().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")) : "";

                boolean[] options = {result.getBoolean("useKimmys"), result.getBoolean("useAddress"), result.getBoolean("useNumber")};
                String[] placeholder = {};

                Label label = new Label(result.getString("name"), result.getInt("size"),
                    result.getString("ingredients"), result.getString("mark"), expirationString,
                    options, additionString, placeholder);

                data.add(label);
            }
        }
        catch (Exception e) {
            throw new RuntimeException("fetchDataDB - Failed to convert DB data", e);
        }

        return data;
    }

    public static void syncJsonAndSQL (List<Label> labels) throws SQLException {
        if (connection == null || connection.isClosed()) {
            System.err.println("setDB - No connection to server!");
            return;
        }

        try {
            clearDB();

            int numRowsAdded = 0;
            for (int i = 0; i < labels.size(); i++) {
                PreparedStatement statement = connection.prepareStatement(
                        "INSERT INTO" + TABLE + "( name, size, ingredients, mark, expiration, useKimmys, useAddress, useNumber, additionDate ) " +
                                "VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? );"
                );
                prepareStatement(labels.get(i), statement);

                numRowsAdded += statement.executeUpdate();
            }

            System.out.println("syncJsonAndSQL - SQL synced to match the JSON file! " + numRowsAdded + " rows added!");
        } catch (Exception e) {
            throw new RuntimeException("syncJsonAndSQL - An error occurred removing from database", e);
        }
    }
}
