package server;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class jsonManager {
    public static void createFile(String fileName) {
        try {
            File jsonFile = new File(fileName);

            if (jsonFile.createNewFile()) {
                System.out.println("File created - " + jsonFile.getName());
                FileWriter writer = new FileWriter(jsonFile);
                writer.write("[]");
                writer.close();
            }
            else {
                System.out.println("File already exists!");
            }
        }
        catch (IOException e) {
            System.out.println("createFile - An error occurred creating .json file.");
            e.printStackTrace();
            System.exit(-1);
        }
    }

    public static void ensureValidFile(File jsonFile, String fileName) {
        try {
            createFile(fileName);
            if (jsonFile.length() == 0) {
                System.out.println("LENGTH == 0, RESETTING");

                FileWriter writer = new FileWriter(jsonFile);
                writer.write("[]");
                writer.close();
            }
        }
        catch (Exception e) {
            System.out.println("ensureValidFile - An error occurred checking the file.");
            e.printStackTrace();
            System.exit(-1);
        }
    }

    public static void add(String fileName, Label data) throws IOException {
        try {
            File jsonFile = new File(fileName);

            System.out.println("ADD - ");
            ensureValidFile(jsonFile, fileName);

            ObjectMapper objectMapper = new ObjectMapper();
            List<Label> labels = new ArrayList<>();

            if (jsonFile.exists() && jsonFile.length() > 0) {
                labels = objectMapper.readValue(jsonFile, new TypeReference<>() {});
            }

            labels.add(data);

            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(jsonFile, labels); // Write the updated list

            System.out.println("server.Label added successfully.");
        }
        catch (Exception e) {
            System.out.println("add (Java) - An error occurred setting .json file data.");
            e.printStackTrace();
            System.exit(-1);
        }
    }

    public static void set(String fileName, List<Label> data) {
        try {
            File jsonFile = new File(fileName);

            System.out.println("SET:");
            ensureValidFile(jsonFile, fileName);

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File(fileName), data);

            System.out.println("server.Label set successfully.");
        }
        catch (Exception e) {
            System.out.println("set (Java) - An error occurred setting data in .json file.");
            e.printStackTrace();
            System.exit(-1);
        }
    }

    public static List<Label> fetchData(String fileName) {
        try {
            File jsonFile = new File(fileName);

            System.out.println("FETCHDATA:");
            ensureValidFile(jsonFile, fileName);

            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(jsonFile, new TypeReference<>() {});
        }
        catch (Exception e) {
            System.out.println("FetchData - An error occurred converting data from .json file into object.");
            e.printStackTrace();
            System.exit(-1);
        }
        return null;
    }

    public static int findEntry(List<Label> data, String name) {
        for (int i = 0; i < data.size(); i++) {
            if (data.get(i).getName().equals(name)) {
                return i;
            }
        }

        System.out.println(name + " not found in .json data.");
        return -1;
    }

    public static int findEntry(List<Label> data, String name, int size) {
        for (int i = 0; i < data.size(); i++) {
            if (data.get(i).getName().equals(name)) {
                if (data.get(i).getSize() == size) {
                    return i;
                }
            }
        }

        System.out.println(name + " with size " + size + " oz not found in .json data.");
        return -1;
    }

    public static class EditLabelContainer {
        public Label originalLabel;
        public Label newLabel;
    }
}
