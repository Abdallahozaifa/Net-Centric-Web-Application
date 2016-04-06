/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import java.beans.*;
import java.io.Serializable;

public class Student implements Serializable {
    private String firstName, lastName, PSUID, team;
    
    public Student(){
    }
    
    /**
     * Setters for a students first name, last name, psu id, and team number
     * @param firstName 
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public void setPSUID(String ID) {
        this.PSUID = ID;
    }
    
    public void setteam(String team) {
        this.team = team;
    }
    
    /**
     * Getters for a students first name, last name, psu id, and team number
     * @return 
     */
    public String getFirstName() {
        return firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public String getPSUID() {
        return PSUID;
    }
    
    public String getteam() {
        return team;
    }
    
    
    // BS
    /*
    public void setSampleProperty(String value) {
        String oldValue = sampleProperty;
        sampleProperty = value;
        propertySupport.firePropertyChange(PROP_SAMPLE_PROPERTY, oldValue, sampleProperty);
    }
    
    public void addPropertyChangeListener(PropertyChangeListener listener) {
        propertySupport.addPropertyChangeListener(listener);
    }
    
    public void removePropertyChangeListener(PropertyChangeListener listener) {
        propertySupport.removePropertyChangeListener(listener);
    }
    */
    
}
