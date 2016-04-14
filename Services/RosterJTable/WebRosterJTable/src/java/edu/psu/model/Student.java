package edu.psu.model;

public class Student {

private int team;
private String firstName;
private String lastName;
private String userID;

public int getTeam() {
	return team;
}

public String getFirstName() {
	return firstName;
}

public String getLastName() {
	return lastName;
}

public String getuserId() {
	return userID;
}

public void setuserId(String studentId) {
	this.userID = studentId;
}

public void setFirstName(String name) {
	this.firstName = name;
}

public void setLastName(String name) {
	this.lastName = name;
}

public void setTeam(int team) {
	this.team = team;
}

}