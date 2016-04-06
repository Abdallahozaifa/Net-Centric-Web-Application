<%-- 
    Document   : roster
    Created on : Mar 30, 2016, 3:53:07 PM
    Author     : dql5295
--%>

<%@page import="java.util.Arrays"%>
<%@page import="java.util.Comparator"%>
<%@page import="java.util.Collections"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="models.Roster"%>
<%@page import="models.Student"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
    <head>
        <script src="sort-table.js"></script>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    
    <body>
        <h1>Hello World!</h1>
        <jsp:useBean id="RosterBean" class="models.Roster">
        <% 
        java.util.ArrayList<models.Student> students = RosterBean.getStudents();
        
        out.println("<table class='sortable'>");
        
        out.println("<tr>");
        out.print("<th id='h1'>" + students.get(0).getLastName() + "</th>");
        out.print("<th id='h2'>" + students.get(0).getFirstName() + "</th>");
        out.print("<th id='h3'>" + students.get(0).getPSUID() + "</th>");
        out.print("<th id='h4'>" + students.get(0).getteam() + "</th>");
        out.println("</tr>");

        
        for (int i=1; i < students.size(); i++) {
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
        </jsp:useBean>

            
            
        </table>

       <% //${roster.getStudents().get(0);} %> 

    </body>
</html>
