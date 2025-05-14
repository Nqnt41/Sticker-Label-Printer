package server;

import java.sql.*;

import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class sqlManager {
    private static final String URL = "jdbc:mysql://localhost/";
    static final String USER = "guest";
    static final String PASSWORD = "guest123";
    private static Connection connection = null;

    public static Connection establishConnection() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            return connection;
        }

        try {
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Database connection established successfully.");

            Statement statement = connection.createStatement();
            statement.executeUpdate("CREATE DATABASE IF NOT EXISTS StickerPrinter");
            System.out.println("Database created successfully, if didn't exist.");

            connection.setCatalog("StickerPrinter");

            statement.executeUpdate(
                "CREATE TABLE Labels (" +
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
            System.out.println("Created table for sticker labels.");

            return connection;
        }

        catch (SQLException e) {
            System.err.println("establishConnection - Failed to establish database connection.");
            System.out.println("SQLException: " + e.getMessage());
            System.out.println("SQLState: " + e.getSQLState());
            System.out.println("VendorError: " + e.getErrorCode());

            return null;
        }
    }

    public static void addDB(Label data) throws SQLException {
        if (connection == null || connection.isClosed()) {
            System.err.println("addDB - No connection to server!");
            return;
        }

        try {
            PreparedStatement statement = connection.prepareStatement(
                "INSERT INTO Labels ( name, size, ingredients, mark, expiration, useKimmys, useAddress, useNumber, additionDate ) " +
                "VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? );"
            );
            statement.setString(1, data.getName());
            statement.setInt(2, data.getSize());
            statement.setString(3, data.getIngredients());
            statement.setString(4, data.getMark());

            SimpleDateFormat formatter = new SimpleDateFormat("M/d/yyyy");
            java.util.Date utilDate = formatter.parse(data.getExpiration());
            java.sql.Date formattedDate = new java.sql.Date(utilDate.getTime());
            statement.setDate(5, formattedDate);

            statement.setBoolean(6, data.getOptions()[0]);
            statement.setBoolean(7, data.getOptions()[1]);
            statement.setBoolean(8, data.getOptions()[2]);
            statement.setString(9, data.getAdditionDate());
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
                "UPDATE Labels" +
                "SET (name = ?, size = ?, ingredients = ?, mark = ?, expiration = ?, useKimmys = ?, useAddress = ?, useNumber = ?, additionDate = ?)" +
                "WHERE id = ?;"
            );
            statement.setString(1, data.getName());
            statement.setInt(2, data.getSize());
            statement.setString(3, data.getIngredients());
            statement.setString(4, data.getMark());

            SimpleDateFormat formatter = new SimpleDateFormat("M/d/yyyy");
            java.util.Date utilDate = formatter.parse(data.getExpiration());
            java.sql.Date formattedDate = new java.sql.Date(utilDate.getTime());
            statement.setDate(5, formattedDate);

            statement.setBoolean(6, data.getOptions()[0]);
            statement.setBoolean(7, data.getOptions()[1]);
            statement.setBoolean(8, data.getOptions()[2]);
            statement.setString(9, data.getAdditionDate());
            statement.setInt(10, idNum);
        }
        catch (Exception e) {
            throw new RuntimeException("setDB - An error occurred adding to database", e);
        }
    }

    public static List<Label> fetchDataDB() throws SQLException {
        if (connection == null || connection.isClosed()) {
            System.err.println("setDB - No connection to server!");
            return new ArrayList<>();
        }

        try {
            List<Label> data = new ArrayList<>();

            try (Statement statement = connection.createStatement(); ResultSet result = statement.executeQuery("SELECT * FROM Labels")) {
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

            return data;
        }
        catch (Exception e) {
            throw new RuntimeException("fetchDataDB - Failed to convert DB data", e);
        }
    }
}
