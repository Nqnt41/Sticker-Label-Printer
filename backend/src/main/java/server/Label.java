package server;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Label {
    private String name;
    private int size;
    private String ingredients;
    private String mark;
    private String expiration;
    private boolean[] options;
    private String additionDate;

    @JsonIgnoreProperties(ignoreUnknown = true)
    @JsonCreator
    public Label(
            @JsonProperty("name") String name,
            @JsonProperty("size") int size,
            @JsonProperty("ingredients") String ingredients,
            @JsonProperty("mark") String mark,
            @JsonProperty("expiration") String expiration,
            @JsonProperty("options") boolean[] options,
            @JsonProperty("additionDate") String additionDate
        ) {
        this.name = name;
        this.size = size;
        this.ingredients = ingredients;
        this.mark = mark;
        this.expiration = expiration;
        this.options = options;
        this.additionDate = additionDate;
    }

    // Getters
    public String getName() {
        return name;
    }

    public int getSize() {
        return size;
    }

    public String getIngredients() {
        return ingredients;
    }

    public String getMark() {
        return mark;
    }

    public String getExpiration() {
        return expiration;
    }

    public boolean[] getOptions() {
        return options;
    }

    public String getAdditionDate() {
        return additionDate;
    }

    // Setters
    public void setName(String name) {
        this.name = name;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public void setMark(String mark) {
        this.mark = mark;
    }

    public void setExpiration(String expiration) {
        this.expiration = expiration;
    }

    public void setOptions(boolean[] options) {
        this.options = options;
    }

    public void setAdditionDate(String additionDate) {
        this.additionDate = additionDate;
    }
}
