
package Controller;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import Models.Roster;
import Models.Student;

/**
 *
 * @author Dalofeco
 */
@WebServlet(name = "RosterCRUDController", urlPatterns = {"/RosterCRUDController"})
public class RosterCRUDController extends HttpServlet {

    Roster RosterBean;
    public RosterCRUDController() {
        RosterBean = new Roster();
    }
    
    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String studentId = request.getParameter("id");
        String team = request.getParameter("team");
        
        Student newStudent = new Student();
        newStudent.setFirstName(firstName);
        newStudent.setLastName(lastName);
        newStudent.setPSUID(studentId);
        newStudent.setteam(team);
        
        RosterBean.addStudent(newStudent);
    }

    
    
    
    
    
    
    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
