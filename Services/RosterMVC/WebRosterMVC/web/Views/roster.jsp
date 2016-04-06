<%-- 
    Document   : roster
    Created on : Mar 30, 2016, 3:53:07 PM
    Author     : dql5295
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="Models.Roster"%>
<%@page import="Models.Student"%>
<!DOCTYPE html>
<html>
    <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
        <script src="/WebRosterMVC/Views/roster.js"></script>
        <script src="Views/sort-table.js"></script>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Roster</title>
    </head>
    
    <body>
        <h1>RosterMVC REST Application</h1>
        <span>
            <button id="addStudentButton">Add Student</button>
            <button id="deleteStudentButton">Delete Student</button>
            <button id="deleteTeamButton">Delete Team</button>
        </span>
        <jsp:useBean id="RosterBean" class="Models.Roster" scope="application">
            <p>Bean Created!</p>
        </jsp:useBean>
        <% 
        java.util.ArrayList<Student> students = RosterBean.getStudents();
        
        out.println("<table id='rosterTable' class='sortable'>");
        
        out.println("<tr>");
        out.print("<th id='h1'>" + RosterBean.getHeader().getLastName() + "</th>");
        out.print("<th id='h2'>" + RosterBean.getHeader().getFirstName() + "</th>");
        out.print("<th id='h3'>" + RosterBean.getHeader().getPSUID() + "</th>");
        out.print("<th id='h4'>" + RosterBean.getHeader().getteam() + "</th>");
        out.println("</tr>");

        
        for (int i=0; i < students.size(); i++) {
            out.println("<tr>");
            
            out.print("<td>");
            out.print(students.get(i).getFirstName());
            out.print("</td>");
            
            out.print("<td> ");
            out.print(students.get(i).getLastName());
            out.print("</td>");
            
            out.print("<td> ");
            out.print(students.get(i).getPSUID());
            out.print("</td>");
            
            out.print("<td>");
            out.print(students.get(i).getteam());
            out.print("</td>");
            
            out.println("</tr>");   
        }
        
        out.println("</table>");

        %>
                     
        </table>
        
    </body>
</html>
