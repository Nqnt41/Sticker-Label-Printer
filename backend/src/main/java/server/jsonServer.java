package server;

import com.fasterxml.jackson.databind.ObjectMapper;
import spark.Spark;

import java.io.File;
import java.sql.Connection;
import java.util.List;
import static spark.Spark.*;

public class jsonServer {
    public static void main(String[] args) {
        port(4567);

        enableCORS();

        // BOTH
        get("/", (request, response) -> {
            try {
                File jsonFile = new File("labels.json");

                jsonManager.ensureValidFile(jsonFile, "labels.json");

                return "Backend is running - try accessing /get-labels for json information.";
            }
            catch (Exception e) {
                return "Error accessing main page.";
            }
        });

        // SQL
        post("/check-sql-connection", (request, response) -> {
            try {
                ObjectMapper objectMapper = new ObjectMapper();

                System.out.println("Raw request body: " + request.body());

                SQLConnection conn = objectMapper.readValue(request.body(), SQLConnection.class);

                System.out.println(conn.toString());

                Connection connection = sqlManager.establishConnection(conn);

                if (connection == null) {
                    System.out.println("check-sql-connection: Connection == null.");
                    response.status(404);
                    return false;
                }

                return true;
            }
            catch (Exception e) {
                System.out.println("check-sql-connection: Failed to connect to SQL database.");
                response.status(404);
                return false;
            }
        });

        // BOTH
        get("/close-backend", (request, response) -> {
            Spark.stop();

            new Thread(() -> {
                try {
                    Thread.sleep(5000);
                    System.exit(0);
                }
                catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();

            return "Backend closing down.";
        });

        // JSON
        get("/get-labels", (request, response) -> {
            try {
                response.type("application/json");
                List<Label> labels = jsonManager.fetchData("labels.json");

                return new ObjectMapper().writeValueAsString(labels);
            }
            catch (Exception e) {
                response.status(404);
                return "get-labels: Error occurred, unable to get labels from json.";
            }
        });

        // SQL
        get("/get-sql-labels", (request, response) -> {
            try {
                response.type("application/json");
                List<Label> labels = sqlManager.fetchDataDB();

                for (int i = 0; i < labels.size(); i++) {
                    System.out.println("GET: " + labels.get(i).getName());
                }

                return new ObjectMapper().writeValueAsString(labels);
            }
            catch (Exception e) {
                response.status(404);
                return "get-labels: Error occurred, unable to get labels from json.";
            }
        });

        // JSON
        post("/add-label", (request, response) -> {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Label newLabel = objectMapper.readValue(request.body(), Label.class);

                List<Label> labels = jsonManager.fetchData("labels.json");

                labels.add(newLabel);
                jsonManager.set("labels.json", labels);

                return "server.Label added successfully!";
            }
            catch (Exception e) {
                response.status(404);
                return "add-label: Error occurred - unable to add label.";
            }
        });

        // SQL
        post("/add-sql-label", (request, response) -> {
            try {
                ObjectMapper objectMapper = new ObjectMapper();

                System.out.println("ADD - Raw request body: " + request.body());

                Label newLabel = objectMapper.readValue(request.body(), Label.class);
                sqlManager.addDB(newLabel);

                List<Label> labels = sqlManager.fetchDataDB();

                response.type("application/json");
                return objectMapper.writeValueAsString(labels);
            }
            catch (Exception e) {
                response.status(404);
                return "add-label: Error occurred - unable to add label.";
            }
        });

        // JSON
        put("/edit-label", (request, response) -> {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                jsonManager.EditLabelContainer updateRequest = objectMapper.readValue(request.body(), jsonManager.EditLabelContainer.class);

                Label originalLabel = updateRequest.originalLabel;
                Label newLabel = updateRequest.newLabel;

                List<Label> labels = jsonManager.fetchData("labels.json");

                int replaceIndex;
                try {
                    replaceIndex = jsonManager.findEntry(labels, originalLabel.getName(), originalLabel.getSize());
                }
                catch (NumberFormatException e) {
                    response.status(400);
                    return "edit-label: Failed to find index";
                }

                if (replaceIndex >= 0 && replaceIndex < labels.size()) {
                    labels.set(replaceIndex, newLabel);
                    jsonManager.set("labels.json", labels);
                }
                else {
                    response.status(404);
                    return "edit-label: Index out of bounds.";
                }

                return "server.Label edited successfully";
            }
            catch(Exception e) {
                response.status(404);
                return "edit-label: Error occurred, unable to edit.";
            }
        });

        // SQL
        put("/edit-sql-label", (request, response) -> {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                sqlManager.EditLabelContainer updateRequest = objectMapper.readValue(request.body(), sqlManager.EditLabelContainer.class);

                Label originalLabel = updateRequest.originalLabel;
                Label newLabel = updateRequest.newLabel;

                sqlManager.editLabelSQL(originalLabel, newLabel);

                return "edit-sql-label: Label edited successfully!";
            }
            catch (Exception e) {
                response.status(404);
                e.printStackTrace();
                return "edit-label: Error occurred, unable to edit label.";
            }
        });

        // JSON
        delete("/delete-label", (request, response) -> {
            try {
                String name = request.queryParams("name");
                String sizeString = request.queryParams("size");
                String indexString = request.queryParams("index");

                List<Label> labels = jsonManager.fetchData("labels.json");

                int removeIndex;
                if (indexString != null) {
                    removeIndex = Integer.parseInt(indexString);
                } else {
                    removeIndex = jsonManager.findEntry(labels, name, Integer.parseInt(sizeString));
                }

                if (removeIndex != -1) {
                    labels.remove(removeIndex);
                    jsonManager.set("labels.json", labels);
                    return "server.Label removed successfully";
                } else {
                    response.status(404);
                    return "Could not find/remove label";
                }
            }
            catch (Exception e) {
                response.status(404);
                return "delete-label: Error occurred, unable to delete label.";
            }
        });

        // SQL
        delete("/delete-sql-label", (request, response) -> {
            try {
                String name = request.queryParams("name");
                String sizeString = request.queryParams("size");
                int size = Integer.parseInt(sizeString);

                sqlManager.removeLabelSQL(name, size);

                return "delete-sql-label: Label removed successfully!";
            }
            catch (Exception e) {
                response.status(404);
                return "delete-label: Error occurred, unable to delete label.";
            }
        });

        // JSON

    }

    // BOTH
    private static void enableCORS() {
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        });
    }
}
