package server;

import java.sql.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class sqlManager {
    private static Connection connection = null;

    public static String TABLE = "";

    public static Connection establishConnection(SQLConnection conn) throws SQLException {
        if (connection != null && !connection.isClosed()) {
            return connection;
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            String url = "jdbc:mysql://" + conn.getHostname() + ":" + conn.getPort() + "/" + conn.getDbName();

            System.out.println("Attempting to connect to database with the following information...");
            System.out.println("URL: " + url + ", Username: " + conn.getUser() + ", Password: " + conn.getPassword());
            connection = DriverManager.getConnection(url, conn.getUser(), conn.getPassword());

            System.out.println("Database connection established successfully.");

            Statement statement = connection.createStatement();

            statement.executeUpdate("CREATE DATABASE IF NOT EXISTS " + conn.getDbName());
            System.out.println("Database created successfully, if did not already exist.");

            Statement tableStatement = connection.createStatement();

            tableStatement.executeUpdate(
                "CREATE TABLE IF NOT EXISTS " + conn.getTable() + " (" +
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
            System.out.println("Created table for sticker labels if did not already exist.");

            System.out.println("Connection object returned: " + connection);

            TABLE = conn.getTable();

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
        try {
            statement.setString(1, data.getName());
            statement.setInt(2, data.getSize());
            statement.setString(3, data.getIngredients());
            statement.setString(4, data.getMark());

            SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");

            if (data.getExpiration() != null && !data.getExpiration().isEmpty()) {
                try {
                    java.util.Date utilDate = formatter.parse(data.getExpiration());
                    Date formattedDate = new Date(utilDate.getTime());
                    statement.setDate(5, formattedDate);
                } catch (ParseException e) {
                    statement.setNull(5, java.sql.Types.DATE);
                }
            } else {
                statement.setNull(5, java.sql.Types.DATE);
            }

            statement.setBoolean(6, data.getOptions()[0]);
            statement.setBoolean(7, data.getOptions()[1]);
            statement.setBoolean(8, data.getOptions()[2]);

            if (data.getAdditionDate() != null && !data.getAdditionDate().isEmpty()) {
                try {
                    java.util.Date utilAdditionDate = formatter.parse(data.getAdditionDate());
                    Date formattedAdditionDate = new Date(utilAdditionDate.getTime());
                    statement.setDate(9, formattedAdditionDate);
                } catch (ParseException e) {
                    statement.setNull(9, java.sql.Types.DATE);
                }
            }
            else {
                statement.setNull(9, java.sql.Types.DATE);
            }

            System.out.println("PrepareStatement succeeded.");
        }
        catch (Exception e) {
            e.printStackTrace();
            System.err.println("PrepareStatement: error preparing statement");
        }
    }

    public static void addDB(Label label) throws SQLException {
        if (connection == null || connection.isClosed()) {
            System.err.println("addDB - No connection to server!");
            return;
        }

        try {
            System.out.println("addDB" + TABLE);

            PreparedStatement statement = connection.prepareStatement(
                "INSERT INTO " + TABLE + " ( name, size, ingredients, mark, expiration, useKimmys, useAddress, useNumber, additionDate ) " +
                "VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? );"
            );
            prepareStatement(label, statement);

            int rowsAffected = statement.executeUpdate();
            System.out.println("addDB - Rows affected: " + rowsAffected);
        }
        catch (Exception e) {
            throw new RuntimeException("addDB - An error occurred adding to database", e);
        }
    }

    public static void removeLabelSQL(String name, int size) throws SQLException {
        if (connection == null || connection.isClosed()) {
            System.err.println("removeLabelSQL - No connection to server!");
            return;
        }

        try {
            PreparedStatement statement = connection.prepareStatement(
                    "DELETE FROM " + TABLE + " WHERE name = ? AND size = ?;"
            );
            statement.setString(1, name);
            statement.setInt(2, size);

            int rowsAffected = statement.executeUpdate();
            System.out.println("removeLabelSQL - Rows affected: " + rowsAffected);
        }
        catch (Exception e) {
            throw new RuntimeException("removeLabelSQL - An error occurred removing from database", e);
        }
    }

    public static void editLabelSQL(Label originalLabel, Label newLabel) throws SQLException {
        if (connection == null || connection.isClosed()) {
            System.err.println("setDB - No connection to server!");
            return;
        }

        try {
            System.out.println("labels: " + originalLabel + " - " + newLabel);

            PreparedStatement statement = connection.prepareStatement(
                    "UPDATE " + TABLE +
                        " SET name = ?, size = ?, ingredients = ?, mark = ?, expiration = ?, useKimmys = ?, useAddress = ?, useNumber = ?, additionDate = ? " +
                        "WHERE name = ? AND size = ?;"
            );
            prepareStatement(newLabel, statement);
            statement.setString(10, originalLabel.getName());
            statement.setInt(11, originalLabel.getSize());

            int rowsAffected = statement.executeUpdate();
            System.out.println("editLabelSQL - Rows affected: " + rowsAffected);
        }
        catch (Exception e) {
            throw new RuntimeException("editLabelSQL - An error occurred editing database", e);
        }
    }

    public static void clearDB() throws SQLException {
        if (connection == null || connection.isClosed()) {
            System.err.println("clearDB - No connection to server!");
            return;
        }

        try {
            PreparedStatement statement = connection.prepareStatement(
                    "DELETE FROM " + TABLE + ";"
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
            ResultSet result = statement.executeQuery("SELECT * FROM " + TABLE + ";")) {

            while (result.next()) {
                java.sql.Date expirationDate = result.getDate("expiration");
                String expirationString = expirationDate != null ? expirationDate.toLocalDate().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")) : "";

                java.sql.Date additionDate = result.getDate("additionDate");
                String additionString = additionDate != null ? additionDate.toLocalDate().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")) : "";

                boolean[] options = {result.getBoolean("useKimmys"), result.getBoolean("useAddress"), result.getBoolean("useNumber")};

                Label label = new Label(result.getString("name"), result.getInt("size"),
                    result.getString("ingredients"), result.getString("mark"), expirationString,
                    options, additionString);

                System.out.println("Label: " + label.getName() + " " + label.getSize() + " " + label.getIngredients()
                        + " " + label.getMark() + " " + label.getExpiration() + " ");
                /*
                    this.name = name;
                    this.size = size;
                    this.ingredients = ingredients;
                    this.mark = mark;
                    this.expiration = expiration;
                    this.options = options;
                    this.additionDate = additionDate;
                 */

                data.add(label);
            }
        }
        catch (Exception e) {
            throw new RuntimeException("fetchDataDB - Failed to convert DB data", e);
        }

        System.out.println("GET: ");
        for (int i = 0; i < data.size(); i++) {
            System.out.println(i + " " + data.get(i).getName());
        }

        return data;
    }

    public static void syncJSONAndSQL (List<Label> labels) throws SQLException {
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

    public static class EditLabelContainer {
        public Label originalLabel;
        public Label newLabel;
    }
}
