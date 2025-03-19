package server;

import com.fasterxml.jackson.databind.ObjectMapper;
import spark.Spark;

import java.util.List;
import static spark.Spark.*;

public class jsonServer {
    public static void main(String[] args) {
        port(4567);

        enableCORS();

        get("/", (request, response) -> {
            try {
                return "Backend is running - try accessing /get-labels for json information.";
            }
            catch (Exception e) {
                return "Error accessing main page.";
            }
        });

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

        post("/add-label", (request, response) -> {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Label newLabel = objectMapper.readValue(request.body(), Label.class);

                List<Label> labels = jsonManager.fetchData("labels.json");

                System.out.println();

                labels.add(newLabel);
                jsonManager.set("labels.json", labels);

                return "server.Label added successfully!";
            }
            catch (Exception e) {
                response.status(404);
                return "add-label: Error occurred - unable to add label.";
            }
        });

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
                } else {
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
    }

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
