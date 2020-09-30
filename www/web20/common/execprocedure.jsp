<html>
<head>
<title>Database</title>
</head>
<%@ page import="java.sql.*" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.io.*" %>
<%response.setHeader("Cache-Control", "no-cache");%>
<%response.setHeader("pragma", "no-cache");%>
<%response.setDateHeader("Expires", -1);%>
<body>
<%! 
	public void ReplacePageInParentFrame(String sUrl){
	}
%>
<% System.out.println("test"); %>

The current date is <%= new Date() %>.
<h2>Employee Phone Numbers</h2>
<table border="1">
<tr><th>ID Reservation<th>Name<th>Company</tr>
<%
Class.forName("oracle.jdbc.OracleDriver");
Connection con = DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521:orcl", "helico01","helico123");

Statement stmt1 = con.createStatement();
ResultSet rs1 = stmt1.executeQuery("{call procInsertIntoReservation }");

Statement stmt2 = con.createStatement();
ResultSet rs2 = stmt2.executeQuery("SELECT * FROM reservation where changeddate = (select max(changeddate) from reservation)");

while(rs2.next()){
	String reservationid = rs2.getString("reservationid");
	String displayname = rs2.getString("displayname");
	String company = rs2.getString("company");

	out.print("<tr>");
	out.print("<td>" + reservationid + "</td>");
	out.print("<td>" + displayname + "</td>");
	out.print("<td>" + company + "</td>");
	out.print("</tr>");
} 
con.close();
%>
</table>
</body>
</html>