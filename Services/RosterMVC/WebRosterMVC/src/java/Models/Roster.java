/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Models;

import java.beans.*;
import java.io.FileNotFoundException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.io.FileReader;
import java.io.InputStreamReader;

/**
 *
 * @author dql5295
 */
public class Roster implements Serializable {
    
    private PropertyChangeSupport propertySupport;
    private ArrayList<Student> students;
    private Student header;
    
    static int numOfDetails = 4;
    
    public Roster() {    
        try {
            students = new ArrayList();
            int count = 0;
            String line[] = new String[numOfDetails];
            boolean firstRead = true;
            
            InputStream inputStream = Roster.class.getResourceAsStream("Roster.txt");
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
                        
            while((line[count] = bufferedReader.readLine()) != null) {
                if (count == (numOfDetails-1)) {
                                        
                    Student student = new Student();
                    student.setLastName(line[0]);
                    student.setFirstName(line[1]);
                    student.setPSUID(line[2]);
                    student.setteam(line[3]);
                    if (firstRead) {
                        header = student;
                        firstRead = false; // so the header is only saved on the first read
                    } else
                        students.add(student);
                    
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
    
    public void addStudent(Student student) {
        if (students != null)
            students.add(student);
    }
    
    public void deleteStudent(Student student) {
        students.remove(student);
    }
    
    public void deleteStudent(int index) {
        students.remove(index);
    }
    
    public Student getHeader() {
        return header;
    }
    
    public void deleteTeam(int teamNumber) {
        for (int i = 0; i < students.size(); i++) {
            Student student = students.get(i);
            
            // if the team number is the same for that student, delete him
            if (Integer.parseInt(student.getteam()) == teamNumber)
                deleteStudent(i);
        }
    }

    
    
}
