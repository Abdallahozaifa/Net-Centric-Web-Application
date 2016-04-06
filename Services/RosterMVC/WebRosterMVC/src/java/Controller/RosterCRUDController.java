
package Controller;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import Models.Roster;
import Models.Student;
import java.util.Enumeration;

/**
 *
 * @author Dalofeco
 */
@WebServlet(name = "RosterCRUDController", urlPatterns = {"/Roster"})
public class RosterCRUDController extends HttpServlet {
    
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
        
        RequestDispatcher rd = request.getRequestDispatcher("Views/roster.jsp");
        rd.forward(request, response);
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
        if (request.getParameter("purpose").equals("delete"))
            doDelete(request, response);
        else {
            String firstName = request.getParameter("firstName");
            String lastName = request.getParameter("lastName");
            String studentId = request.getParameter("id");
            String team = request.getParameter("team");

            Student newStudent = new Student();
            newStudent.setFirstName(firstName);
            newStudent.setLastName(lastName);
            newStudent.setPSUID(studentId); 
            newStudent.setteam(team);

            Roster rosterBean;
            rosterBean = getRosterBean();
            rosterBean.addStudent(newStudent);
            saveRosterBean(rosterBean);
        }

    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Gets what is going to be deleted
        boolean byName = false;
        for (Enumeration<String> e = request.getParameterNames(); e.hasMoreElements();)
            if (e.nextElement().equals("firstName"))
                byName = true;
                
        String target = request.getParameter("target");
        if (target.equals("student")) {
            if (byName) {
                String firstName = request.getParameter("firstName");
                String lastName = request.getParameter("lastName");
                Roster rosterBean = getRosterBean();
                rosterBean.deleteStudent(firstName, lastName);
                saveRosterBean(rosterBean);
                
            } else {
                String id = request.getParameter("id");
                Roster rosterBean = getRosterBean();
                rosterBean.deleteStudent(id);
                saveRosterBean(rosterBean);
            }
                
        } else if (target.equals("team")) {
            int teamNumber = Integer.parseInt(request.getParameter("team"));
            Roster rosterBean = getRosterBean();
            rosterBean.deleteStudent(teamNumber);
            saveRosterBean(rosterBean);
        }        
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
    
    private Roster getRosterBean() {
        return (Roster)this.getServletContext().getAttribute("RosterBean");
    }
    
    private void saveRosterBean(Roster rb) {
        this.getServletContext().setAttribute("RosterBean", rb);
    }

}
