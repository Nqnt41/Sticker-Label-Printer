import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

import static spark.Spark.*;

public class jsonServer {
    public static void main(String[] args) {
        port(4567);

        enableCORS();

        get("/get-labels", (request, response) -> {
            response.type("application/json");
            List<Label> labels = jsonManager.fetchData("labels.json");

            return new ObjectMapper().writeValueAsString(labels);
        });

        post("/add-label", (request, response) -> {
            ObjectMapper objectMapper = new ObjectMapper();
            Label newLabel = objectMapper.readValue(request.body(), Label.class);

            List<Label> labels = jsonManager.fetchData("labels.json");

            labels.add(newLabel);
            jsonManager.set("labels.json", labels);

            return "Label added successfully!";
        });

        delete("/delete-label", (request, response) -> {
            String name = request.queryParams("name");
            String sizeString = request.queryParams("size");
            String indexString = request.queryParams("index");

            List<Label> labels = jsonManager.fetchData("labels.json");

            int removeIndex;
            if (indexString != null) {
                removeIndex = Integer.parseInt(indexString);
            }
            else {
                removeIndex = jsonManager.findEntry(labels, name, Integer.parseInt(sizeString));
            }

            if (removeIndex != -1) {
                labels.remove(removeIndex);
                jsonManager.set("labels.json", labels);
                return "Label removed successfully";
            }
            else {
                response.status(404);
                return "Could not find/remove label";
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
            response.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        });
    }
}
