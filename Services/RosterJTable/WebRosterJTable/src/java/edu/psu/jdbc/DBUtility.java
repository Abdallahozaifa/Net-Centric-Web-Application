package edu.psu.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBUtility {

    private static Connection connection = null;

    public static Connection getConnection() {
        if (connection != null) {
            return connection;
        } else {
            try {
                String host = "jdbc:derby://localhost:1527/RosterDB";
                String uName = "app";
                String uPass = "app";
                connection = DriverManager.getConnection(host, uName, uPass);
            } catch (SQLException err) {
                System.out.println(err.getMessage());
                System.out.println("Error connecting with the server! DUH!");
            }
            return connection;
        }
    }
}
