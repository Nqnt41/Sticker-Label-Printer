package server;

public class SQLConnection {
    private String hostname;
    private String port;
    private String dbName;
    private String table;
    private String user;
    private String password;

    public SQLConnection() {}

    public SQLConnection(String hostname, String port, String dbName, String table, String user, String password) {
        this.hostname = hostname;
        this.port = port;
        this.dbName = dbName;
        this.table = table;
        this.user = user;
        this.password = password;
    }

    public String getHostname() {
        return hostname;
    }

    public String getPort() {
        return port;
    }

    public String getDbName() {
        return dbName;
    }

    public String getTable() {
        return table;
    }

    public String getUser() {
        return user;
    }

    public String getPassword() {
        return password;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String toString() {
        return "SQLConnection{" +
                "hostname='" + hostname + '\'' +
                ", port='" + port + '\'' +
                ", dbName='" + dbName + '\'' +
                ", table='" + table + '\'' +
                ", user='" + user + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
