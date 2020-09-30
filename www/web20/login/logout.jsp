<%--
 *
 *
 *
 * (C) COPYRIGHT Talian Limited. 2010
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with us.
 *
--%>


<%--
*********************************************************************************************************
Name: logout.jsp

This page logs out a user from the COCO. This can be customised for any further calls
for LDAP

*********************************************************************************************************
--%>


<%@ page contentType="text/html;charset=UTF-8" buffer="128kb" autoFlush="true" import= "psdi.util.*, psdi.webclient.system.controller.*, psdi.webclient.system.websession.*" %>

<%
	MXSession mxs = RequestHandler.getMXSession(session);

	try
	{
		mxs.disconnect();					
	}
	catch (Exception e)
	{
		//do nothing
	}

	String loginurl = null;

	String loginPage = "login.jsp";
	loginurl = new java.net.URL(new java.net.URL(request.getRequestURL().toString()), loginPage).toString();
		
	String message = (String)session.getAttribute("signoutmessage");	
	if(WebAppEnv.useAppServerSecurity() || message == null)
	{
		session.removeAttribute("signoutmessage");
		session.invalidate();					
	}	
		
	if (!WebAppEnv.useAppServerSecurity())				    
	{
		response.sendRedirect(loginurl);
		return;
	}
	String[] labelList = {"logoutlabel","logoutmessagepart1", "logoutmessagepart2", "loginbtntext","closebtntext"};
	String[] labels = mxs.getMessages("logout", labelList);
	String coName = mxs.getMessage("fusion","CompanyName");
%>

<html>
<head>
<title><%=coName%></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style type="text/css">
<!--
.txterrormsg1 {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 11px;
	font-style: normal;
	font-weight: normal;
	color: #000000;
}
.txterrormsg1accent {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 11px;
	font-style: normal;
	font-weight: normal;
	color: #305F90;
}
.txterrormsg1accentbold {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 11px;
	font-style: normal;
	font-weight: bold;
	color: #305F90;
}
.txtbtn1 {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 11px;
	font-style: normal;
	font-weight: normal;
	color: #000000;
}
a.txtbtn1:link {
	color: #000000;
	text-decoration: none;
}
a.txtbtn1:visited {
	color: #000000;
	text-decoration: none;
}
a.txtbtn1:hover {
	color: #CC6600;
	text-decoration: none;
}
a.txtbtn1:active {
	color: #CC6600;
	text-decoration: none;
}
.dividerlinehorizbottom {
	border-top-width: 1px;
	border-top-style: solid;
	border-top-color: #999999;
	line-height: 2px;
}
.dividerlinehoriztop {
	border-bottom-width: 1px;
	border-bottom-style: solid;
	border-bottom-color: #999999;
	line-height: 2px;
}
.errormsgoutlinetable {
	padding: 10px;
	border: 1px solid #E8E3D9;
}
.spacerrow {
	line-height: 10px;
}
.errortableheader {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 11px;
	font-style: normal;
	font-weight: bold;
	color: #FFFFFF;
	background-color: #305F90;
	border: 2px solid #305F90;
}
-->
</style>
</head>

<body>
<table  border="0" align="center" cellpadding="0" cellspacing="0" class="errormsgoutlinetable">
  <tr>
    <td><table width="500"  border="0" align="center" cellpadding="0" cellspacing="0">
      <tr>
        <td align="right"><img src="images/mxlogo_msgpage.gif" width="86" height="20"></td>
      </tr>
      <tr>
        <td class="errortableheader"><img src="images/information.gif" width="16" height="16" hspace="3" align="absmiddle"><%= labels[0]%></td>
      </tr>
      <tr>
        <td class="spacerrow">&nbsp;</td>
      </tr>
      <tr>
        <td class="txterrormsg1"><p><%= labels[1]%><br> 
          </p>
          <p><%= labels[2]%></p></td>
      </tr>
      <tr>
        <td class="spacerrow">&nbsp;</td>
      </tr>
      <tr>
        <td class="dividerlinehorizbottom">&nbsp;</td>
      </tr>
      <tr>
        <td align="right"><table  border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td><img src="images/buttonleft.gif" width="8" height="20"></td>
                <td background="images/buttonmiddle.gif" class="txtbtn1"><a href="JavaScript:window.close();" class="txtbtn1"><%=labels[4]%></a> </td>
                <td><img src="images/buttonright.gif" width="9" height="20"></td>
                <td>&nbsp;</td>
                <td><img src="images/buttonleft.gif" width="8" height="20"></td>
                <td background="images/buttonmiddle.gif" class="txtbtn1"><a href="<%=loginurl%>" class="txtbtn1"><%=labels[3]%></a> </td>
                <td><img src="images/buttonright.gif" width="9" height="20"></td>
              </tr>
        </table></td>
        </tr>
    </table></td>
  </tr>
</table>
</body>
</html>
<SCRIPT LANGUAGE="JavaScript">
<!--
    <%
		if(message != null)
		{
	%>
			alert('<%=message%>');
	<%
		}
    %>
-->
</SCRIPT>
