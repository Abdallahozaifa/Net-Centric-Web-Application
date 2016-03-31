/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import java.beans.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Serializable;
import java.util.ArrayList;


/**
 *
 * @author dql5295
 */
public class Roster implements Serializable {
    
    private PropertyChangeSupport propertySupport;
    private ArrayList<Student> students;
    
    static int numOfDetails = 4;
    
 
    
    public Roster() {    
        try {
            students = new ArrayList();
            int count = 0;
            String line[] = new String[numOfDetails];
            
            InputStream inputStream = Roster.class.getResourceAsStream("Roster.txt");
            
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
            
            while((line[count] = bufferedReader.readLine()) != null) {
                if (count == (numOfDetails-1)) {
                    Student student = new Student();
                    student.setLastName(line[0]);
                    student.setFirstName(line[1]);
                    student.setPSUID(line[2]);
                    student.setteam(line[3]);
                    students.add(student);
                    System.out.println(students);
                    count = 0;
                } else if (!(line[count].equals(" ")))
                    count++;
            }
        } catch (IOException ex) {
        } 
    }

    
    public ArrayList<Student> getStudents(){
        return students;    
    }

    
}
