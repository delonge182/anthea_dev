<%--
 *
 * Talian Confidential
 *
 * (C) COPYRIGHT Talian, 2011
 *
--%>

<%@ page contentType="text/html;charset=UTF-8" import= "com.talian.web20.system.controller.*, psdi.webclient.system.controller.*, java.util.*, psdi.bo.*, psdi.util.*, psdi.security.*, java.io.*" %>
<%
	String web20Path = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+request.getContextPath()+"/web20";
	String webClientPath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+request.getContextPath()+"/webclient";
	String imagesPath = web20Path + "/images" ;

	SessionContext sessionContext = SessionContext.getSessionContext(request);
	request.setCharacterEncoding("UTF-8");

	String url = new java.net.URL(new java.net.URL(request.getRequestURL().toString()), request.getContextPath()+"/web20/login/login.jsp").toString();
	psdi.util.MXSession s = psdi.webclient.system.controller.RequestHandler.getMXSession(session);
	if (! s.isConnected())
	{
		response.sendRedirect(url);
		return;
	}
	String strTitle = s.getMessage("login","welcome") ;
	String app = (String)request.getAttribute("app") ;
	if (app == null)
		app = "startcntr" ;
	String scid = sessionContext.getSessionContextID() ;

	ProfileRemote profile = s.getProfile() ;
	UserInfo user = s.getUserInfo() ;

	String Ssession = (String)request.getSession().getAttribute("__flightsession__");
	Object Sscenario = request.getSession().getAttribute("__scenario__");
	Date Sdate = (Date)request.getSession().getAttribute("__reservedate__");
	if (Sdate == null)
		Sdate = new Date() ;

	int daySdate = Sdate.getDate() ;
	int monthSdate = Sdate.getMonth() ;
	int yearSdate = Sdate.getYear() ;

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title><%=strTitle%></title>
		<meta HTTP-EQUIV="content-type" CONTENT="text/html; charset=UTF-8">

		<script type="text/javascript" src="<%=web20Path%>/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="<%=web20Path%>/ext-all-debug.js"></script>
		<script type="text/javascript" src="<%=web20Path%>/examples/ux/statusbar/StatusBar.js"> </script>
		<script type="text/javascript" src="<%=web20Path%>/examples/ux/ToolbarReorderer.js"> </script>
		<script type="text/javascript" src="<%=web20Path%>/examples/ux/DataViewTransition.js"> </script>
		<script type="text/javascript" src="<%=web20Path%>/examples/ux/DataView-more.js"> </script>
		<script type="text/javascript" src="<%=web20Path%>/examples/ux/RowEditorNoToolTip.js"> </script>
		<script type="text/javascript" src="<%=web20Path%>/examples/ux/RowExpander.js"> </script>
		<script type="text/javascript" src="<%=web20Path%>/examples/ux/RowLayout.js"> </script>
		<!-- added by efs -->
		<script type="text/javascript" src="<%=web20Path%>/examples/miframe2_1_5/build/miframe[-debug].js"> </script>
		<script type="text/javascript" src="<%=web20Path%>/examples/miframe2_1_5/uxvismode.js"> </script>
		<script type="text/javascript" src="<%=web20Path%>/examples/miframe2_1_5/multidom.js"> </script>
		<script type="text/javascript" src="<%=web20Path%>/examples/miframe2_1_5/mif.js"> </script>
		<script type="text/javascript" src="<%=web20Path%>/examples/miframe2_1_5/mifmsg.js"> </script>
		<script type="text/javascript" src="../examples/ux/GroupTabPanel.js"></script>
    	<script type="text/javascript" src="../examples/ux/GroupTab.js"></script>
    	<script type="text/javascript" src="../examples/ux/Portal.js"></script>
    	<script type="text/javascript" src="../examples/ux/PortalColumn.js"></script>
    	<script type="text/javascript" src="../examples/ux/Portlet.js"></script>
    	<script type="text/javascript" src="../examples/portal/sample-grid.js"></script>
   		<script type="text/javascript" src="../examples/ux/grid/GridFilters.js"></script>
		<script type="text/javascript" src="../examples/ux/grid/filter/Filter.js"></script>
		<script type="text/javascript" src="../examples/ux/grid/filter/StringFilter.js"></script>
		<script type="text/javascript" src="../examples/ux/grid/filter/DateFilter.js"></script>
		<script type="text/javascript" src="../examples/ux/grid/filter/ListFilter.js"></script>
		<script type="text/javascript" src="../examples/ux/grid/filter/NumericFilter.js"></script>
		<script type="text/javascript" src="../examples/ux/grid/filter/BooleanFilter.js"></script>
		<script type="text/javascript" src="../examples/ux/menu/EditableItem.js"></script>
		<script type="text/javascript" src="../examples/ux/menu/RangeMenu.js"></script>
		<script type="text/javascript" src="<%=web20Path%>/examples/ux/fileuploadfield/FileUploadField.js"></script>

		<script type="text/javascript" src="../talian documentation/text.js"></script>
		<script type="text/javascript" src="<%=web20Path%>/app/gmap.js" ></script>
		<script type="text/javascript" src="<%=web20Path%>/app/nongmap.js" ></script>
		<script type="text/javascript" src="<%=web20Path%>/examples/form/states.js"></script>
		<script type="text/javascript" src="<%=web20Path%>/examples/form/combos.js"></script>

    	<link rel="stylesheet" type="text/css" href="<%=web20Path%>/examples/form/combos.css" />
		<link rel="stylesheet" type="text/css" href="<%=web20Path%>/examples/ux/fileuploadfield/css/fileuploadfield.css"/>

    	<script type="text/javascript" src="../examples/ux/CheckColumn.js"></script>
    	<!-- end added by efs -->
		<script type="text/javascript" src="<%=web20Path%>/common/util.js"></script>
		<script type="text/javascript" src="<%=web20Path%>/common/api.js"></script>
		<script type="text/javascript" src="<%=web20Path%>/../djn/djn-remote-call-support.js"></script>
        <script type="text/javascript" src="<%=web20Path%>/../ejn/ejn-assert.js"></script>

		<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=ABQIAAAAA5hFP8FaUqHcTS_vAEmmZxS_OEsLd2UuIKmISfuOQTZsJNEXJBRjI6c5aZUyxwiAKLteeRZojM30oA" type="text/javascript"></script>
		<script src="<%=webClientPath%>/javascript/raphael.js" type="text/javascript"></script>
		<script src="<%=web20Path%>/examples/ux/GMapPanel.js" type="text/javascript"></script>
		<script src="<%=web20Path%>/examples/shared/examples.js" type="text/javascript"></script>

		<!-- Include Ext stylesheets here: -->
		<link rel="stylesheet" type="text/css" href="<%=web20Path%>/examples/shared/examples.css" />
		<link rel="stylesheet" type="text/css" href="<%=web20Path%>/resources/css/ext-all.css" />
		<!-- <link rel="stylesheet" type="text/css" href="<%=web20Path%>/resources/css/xtheme-gray.css"/>  -->
		<link rel="stylesheet" type="text/css" href="<%=web20Path%>/examples/ux/statusbar/css/statusbar.css" />
		<link rel="stylesheet" type="text/css" href="<%=web20Path%>/css/coco.css" />
		<link rel="stylesheet" type="text/css" href="../docs/resources/docs.css" />
		<link rel="stylesheet" type="text/css" href="../examples/ux/css/RowEditor.css" />

    <style type="text/css">
    .x-panel-body p {
        margin:0px;
        font-size:10px;
    }
    </style>

<style type="text/css">
	.app-header .x-panel-body {
	    background-color: #ddd;
	    padding-left: 0px;
	}

	.x-grid3{
		width:100%;
	}

table {
  border-spacing: 0px 0px;
  border-collapse: separate;
  padding: 0px;
  margin: 0px;
  width:100%;
}

	.app-header h1 {
	    font-family: verdana,arial,sans-serif;
	    font-size: 10px;
	    color: #15428B;
	}

	.hospital-target {
		background-color: #fff;
	}

	.hospital-target.hospital-target-hover {
	    background-color: #C0C0C0;
	}

	.patient-source {
	    cursor: pointer;
	    padding: 0px 3px 0px 0px;
	}

	.patient-view td {
	    font-family: verdana,arial,sans-serif;
	    font-size:10px;
	    height: 15px;
	    padding: 0px 3px 0px 0px;
	}

	td.patient-label {
	    background-color: #ddd;
	    border: 1px solid #bbb;
	    text-align: right;
	    width: 40px;
	    height: 5px;
	    padding: 0px 3px 0px 0px;
	}

	td.patient-label-assigned {
	    background-color: #cc0;
	    border: 1px solid #aaa;
	    text-align: right;
	    width: 40px;
	    padding: 0px 0px 0px 0px;
	}

	td.fuel-table {
	    border: 1px solid #aaa;
	    text-align: right;
	    font-family: verdana,arial,sans-serif;
	    padding: 0px 3px 0px 0px;
	}

	td.patient-name {
	    border: 1px solid #bbb;
	    text-align: right;
	    width: 40px;
	    height: 5px;
	    padding: 0px 0px 0px 0px;
	}

	.patient-over {
	    background-color:#EFEFEF;
	    cursor: pointer;
	}
	.patient-selected {
	    background-color: #DFE8F6;
	    cursor: pointer;
	}


</style>

		<script>
		var count2Where = 5;
		Ext.isReloadScenario = false;

		Ext.ux.JSLoader = function(options)
		{
			Ext.ux.JSLoader.scripts[++Ext.ux.JSLoader.index] = {
    			url: options.url,
    			success: true,
    			options: options,
    			onLoad: options.onLoad || Ext.emptyFn,
    			onError: options.onError || Ext.ux.JSLoader.stdError
  			};

  			Ext.Ajax.request({
    			url: options.url,
    			scriptIndex: Ext.ux.JSLoader.index,
    			success: function(response, options) {
      			var script = 'Ext.ux.JSLoader.scripts[' + options.scriptIndex + ']';
      			window.setTimeout('try { ' + response.responseText + ' } catch(e) { '+script+'.success = false; '+script+'.onError('+script+'.options, e); }; if ('+script+'.success) '+script+'.onLoad('+script+'.options);', 100);
    		},
    			failure: function(response, options) {
      			var script = Ext.ux.JSLoader.scripts[options.scriptIndex];
      			script.success = false;
      			script.onError(script.options, response.status);
    		}
  			});
  		}

		Ext.ux.JSLoader.index = 0;
		Ext.ux.JSLoader.scripts = [];

		Ext.ux.JSLoader.stdError = function(options, e) {
  			window.alert('Error loading script:\n\n' + options.url + '\n\n(status: ' + e + ')');
		}
		</script>

		<script type="text/javascript" >
		Ext.talian.REMOTING_API.enableBuffer = 0;
   		var remotingProvider = Ext.Direct.addProvider( Ext.talian.REMOTING_API);

		Ext.reservedDate = '' ;
		Ext.cDate = new Date();
		Ext.cDate.setDate(<%=daySdate%>) ;
		Ext.cDate.setMonth(<%=monthSdate%>) ;
		Ext.cDate.setYear(<%=yearSdate+1900%>) ;
		Ext.cDate.clearTime() ;

		Ext.flightSessionId = '<%=Ssession%>';
		Ext.scenarioId = '<%=Sscenario%>';



	    Ext.dsFlSession = new Ext.data.DirectStore( {
		    paramsAsHash:false,
		    root:'data',
		    directFn: DataBean.getMbo,
		    idProperty:'FLIGHTSESSIONID',
		    totalProperty:'totalProperty',
		    fields: [
		      {name: 'FLIGHTSESSIONID' },
		      {name: 'DESCRIPTION' },
		      {name: 'FLIGHTSESSION' },
		      {name: 'ETD' },
		      {name: 'CHANGEDATE' },
		      {name: 'CHANGEBY'},
		      {name: 'EXTSYSREF'},
		      {name: 'EXTSYSTIMESTAMP'},
		      {name: 'SOURCESYS'},
		      {name: 'RESERVEDDATE'}
		    ],
		    listeners: {
		      load: function(s, records){
				textStatus ("Loaded " + records.length + " records", true, false) ;
				if(typeof(Ext.dsFlSession.getAt(0)) != 'undefined'){
					if(Ext.flightSessionId != ''){
						Ext.cmbFlSession.setValue(Ext.flightSessionId);
					} else {
						Ext.cmbFlSession.setValue(Ext.dsFlSession.getAt(0).data.FLIGHTSESSION);
						EditorBean.selectFlightSession (Ext.dsFlSession.getAt(0).data.FLIGHTSESSION) ;
					}
				}else{
					Ext.cmbFlSession.setValue('');
				};

				if (typeof (Ext.dsReservation) != 'undefined') {
					Ext.dsReservation.baseParams['reservedate'] = Ext.cDate;
					Ext.dsReservation.baseParams['flightsession'] = Ext.cmbFlSession.value;
				    Ext.patientView.store.reload() ;
				};

				Ext.dsScenario.removeAll();
				Ext.dsScenario.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
     													"and flightsession='"+Ext.cmbFlSession.value+"'";
				Ext.dsScenario.load();
		      }
		    },
		    baseParams : {
		        start : 0,
		        limit : 10000,
		        sort : "FLIGHTSESSION",
		        mboname : "FLIGHTSESSION",
		        where : "reserveddate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' }",
		        dir : "ASC"
		    },
		    paramOrder: 'mboname|where|start|limit|sort|dir'
	    });

	    Ext.dsFlSession.load();

		Ext.dsScenario = new Ext.data.DirectStore( {
		    paramsAsHash:false,
		    root:'data',
		    directFn: DataBean.getMbo,
		    idProperty:'FLIGHTSCENARIOID',
		    totalProperty:'totalProperty',
		    fields: [
		      {name: 'FLIGHTSCENARIOID' },
		      {name: 'DESCRIPTION' },
		      {name: 'SCENARIOID' },
		      {name: 'STATUS' },
		      {name: 'TOTFUEL' },
		      {name: 'CRAFTCNT'},
		      {name: 'TOTSVCTIME'},
		      {name: 'TOTPAX'},
		      {name: 'TOTPAYLOAD'},
		      {name: 'OAT'},
		      {name: 'HEADWIND'},
		      {name: 'CREWWEIGHT'},
		      {name: 'RESERVEDATE'},
		      {name: 'FLIGHTSESSION'}
		    ],
		    listeners: {
				load: function(s, records){
					textStatus ("Loaded " + records.length + " records", true, false);
					if(typeof(Ext.dsScenario.getAt(0)) != 'undefined'){
						if(Ext.scenarioId != ''){
							Ext.cmbScenario.setValue(Ext.scenarioId);
						}else {
							Ext.cmbScenario.setValue(Ext.dsScenario.getAt(0).data.SCENARIOID);
						}
					}else{
						Ext.cmbScenario.setValue('');
					};
				}
		    },
		    baseParams : {
		        start : 0,
		        limit : 10000,
		        sort : "TOTSVCTIME",
		        mboname : "FLIGHTSCENARIO",
		        where : "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
						"and flightsession='"+Ext.flightSessionId+"'",
		        dir : "DESC"
		    },
		    paramOrder: 'mboname|where|start|limit|sort|dir'
	    });
	    Ext.dsScenario.load();

	    Ext.dsHeliport = new Ext.data.DirectStore( {
		    paramsAsHash:false,
		    root:'data',
		    directFn: DataBean.getMbo,
		    idProperty:'HELIPORTID',
		    totalProperty:'totalProperty',
		    fields: [
		      {name: 'HELIPORTID' },
		      {name: 'HELIPORT' },
		      {name: 'LATDEGREE' },
		      {name: 'LOTDEGREE' },
		      {name: 'HEADINGANGLE' },
		      {name: 'ISREFUELING'}
		    ],
		    listeners: {
		      load: function(s, records){
				textStatus ("Loaded " + records.length + " records", true, false) ;
		      }
		    },
		    baseParams : {
		        start : 0,
		        limit : 500,
		        sort : "HELIPORT",
		        mboname : "HELIPORT",
		        where : "ishelipad = 1",
		        dir : "ASC"
		    },
		    paramOrder: 'mboname|where|start|limit|sort|dir'
	    });

    	Ext.dsHeliport.load();

	    Ext.cmbScenario = new Ext.form.ComboBox({
	        store: Ext.dsScenario,
	        displayField:'SCENARIOID',
	        typeAhead: true,
	        mode: 'local',
	        forceSelection: true,
	        triggerAction: 'all',
	        emptyText:'Scenario',
	        width: 90,
	        selectOnFocus:true,
			value:Ext.scenarioId,
	        lastQuery: '',
	        listeners: {
		      	select : function() {
	    			Ext.ScenarioId = Ext.cmbScenario.getValue();
	    			Ext.flightSessionId = Ext.cmbFlSession.getValue();

					Ext.reservedDate = Ext.dfReservedDate.getValue() ;
					Ext.cDate = new Date () ;
					Ext.cDate.setDate(Ext.reservedDate.getDate()) ;
					Ext.cDate.setMonth(Ext.reservedDate.getMonth()) ;
					Ext.cDate.setYear(Ext.reservedDate.getFullYear()) ;
					Ext.cDate.clearTime() ;

					EditorBean.selectFlightSession (Ext.flightSessionId) ;
   					EditorBean.selectScenario (Ext.cmbScenario.value, function(retval, e) {
   						Ext.scenarioId = Ext.cmbScenario.getValue();
   						Ext.isReloadScenario = true;
    					reloadRoute();
   						//window.location.reload();
    				});
					//EditorBean.selectScenario (Ext.cmbScenario.value);
		      	},
		      	load: function(s, records){
					textStatus ("Loaded " + records.length + " records", true, false);
				}
			}
	    });

	    Ext.cmbFlSession = new Ext.form.ComboBox({
	        store: Ext.dsFlSession,
	        displayField:'FLIGHTSESSION',
	        typeAhead: true,
	        mode: 'local',
	        forceSelection: true,
	        triggerAction: 'all',
	        value: Ext.flightSessionId,
	        emptyText:'Flight Session',
	        width: 75,
         	listeners: {
				select : function () {
					Ext.flightSessionId = Ext.cmbFlSession.getValue();

					Ext.reservedDate = Ext.dfReservedDate.getValue() ;
					Ext.cDate = new Date () ;
					Ext.cDate.setDate(Ext.reservedDate.getDate()) ;
					Ext.cDate.setMonth(Ext.reservedDate.getMonth()) ;
					Ext.cDate.setYear(Ext.reservedDate.getFullYear()) ;
					Ext.cDate.clearTime() ;

					EditorBean.selectFlightSession (Ext.flightSessionId) ;

					Ext.dsScenario.removeAll();
					Ext.dsScenario.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
														"and flightsession='"+Ext.flightSessionId+"'";
					Ext.dsScenario.load();

					if (typeof (Ext.dataStoreReservation) != 'undefined') {
						Ext.dataStoreReservation.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
														"and flightsession='"+Ext.flightSessionId+"'";
						Ext.dataStoreReservation.reload();
					}

					if (typeof (Ext.dsReservation) != 'undefined') {
						Ext.dsReservation.baseParams['reservedate'] = Ext.cDate ;
						Ext.dsReservation.baseParams['flightsession'] = Ext.flightSessionId ;
					    Ext.patientView.store.reload() ;
					}
				}
		    }
	    });

	    Ext.dfReservedDate = new Ext.form.DateField({
	    	id: 'dfResvDate',
	    	format: 'd/m/Y',
	        mode: 'local',
	        forceSelection: true,
	        triggerAction: 'all',
	        selectOnFocus:true,
	        value: Ext.reservedDate,
			listeners: {
		      select : function () {
					Ext.reservedDate = Ext.dfReservedDate.getValue() ;

					Ext.cDate = new Date () ;
					Ext.cDate.setDate(Ext.reservedDate.getDate()) ;
					Ext.cDate.setMonth(Ext.reservedDate.getMonth()) ;
					Ext.cDate.setYear(Ext.reservedDate.getFullYear()) ;
					Ext.cDate.clearTime() ;
					EditorBean.selectDate (Ext.reservedDate) ;

					Ext.dsFlSession.removeAll()
					Ext.dsFlSession.baseParams['where'] = "reserveddate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' }";
					Ext.dsFlSession.load();

					EditorBean.selectFlightSession (Ext.flightSessionId) ;

					Ext.dsScenario.removeAll();
					Ext.dsScenario.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
      													"and flightsession='"+Ext.cmbFlSession.value+"'";
					Ext.dsScenario.load();

					if (typeof (Ext.dataStoreReservation) != 'undefined') {
						Ext.dataStoreReservation.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
														"and flightsession='"+Ext.flightSessionId+"'";
						Ext.dataStoreReservation.reload();
					}

					if (typeof (Ext.dsReservation) != 'undefined') {
						Ext.dsReservation.baseParams['reservedate'] = Ext.cDate ;
						Ext.dsReservation.baseParams['flightsession'] = Ext.flightSessionId ;
					    Ext.patientView.store.reload() ;
					}
		      }
		    }
	    });

		EditorBean.getCurrentDate(function(retval, e) {
		    var cdate = new Date () ;
			cdate.setDate (retval.day) ;
			cdate.setMonth (retval.month - 1) ;
			cdate.setYear (retval.year) ;
			Ext.dfReservedDate.setValue (cdate) ;
			Ext.reservedDate = cdate ;
		}) ;

		EditorBean.getFlightSession (function(retval, e) {
			Ext.flightSessionId = retval ;
			Ext.cmbFlSession.setValue (Ext.flightSessionId) ;
		});

		EditorBean.getScenario (function(retval, e) {
			Ext.scenarioId = retval ;
			Ext.cmbScenario.setValue (Ext.scenarioId) ;
		});

		function showResultText(btn, text){
			if(btn == 'ok' && text != ''){
				EditorBean.saveFlightSession(text, Ext.reservedDate, function(retval, e) {
   					count2Where++;
					Ext.example.msg('Button Click', 'New FlightSession for {0} has been saved.', Ext.reservedDate);
					Ext.dsFlSession.baseParams['where'] = "reserveddate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } and "+count2Where+"="+count2Where;
   					Ext.cmbFlSession.store.reload();
   				});

			}
	    };

		function setupMenuBar () {
			var handleAction = function(action){
				textStatus ('You clicked "' + action + '"', true, false) ;
		    };

			var mbar = new Ext.Toolbar({
	            enableOverflow: true,
	            renderTo: 'menubar',
	            items: [
	            'Reservation Date: ', Ext.dfReservedDate,'-',
	            {xtype: 'tbspacer', width: 10},
	            'Flight Session: ', Ext.cmbFlSession,'-',
	            {
	            	iconCls: 'insert20',
	            	scale: 'small',
	            	text: 'Add Session',
		            handler: function() {
	            		Ext.MessageBox.prompt('Name', 'Enter The New Flight Session (HHMM):', showResultText);
	            	}
	            },'-',
	            //{xtype: 'tbspacer', width: 10},
	            'Scenario: ', Ext.cmbScenario, '-',
	            {
	            	iconCls: 'insert20',
	            	scale: 'small',
	            	text: 'New Scenario',
		            handler: function() {
	            		//Ext.MessageBox.prompt('Name', 'Enter The New Flight Session (HHMM):', showResultText);
	            		Ext.MessageBox.confirm('Confirm', 'Are you sure you want to create new scenario?',newScenario);
	            	}
	            },'-',
	            {
	            	iconCls: 'save20',
	            	scale: 'small',
	            	text: 'Save Scenario',
		            handler: function() {
	            		EditorBean.saveScenario( function(retval, e) {
		   					Ext.example.msg('SUCCESS', 'New Scenario for {0} has been saved.', Ext.reservedDate);
							Ext.dsScenario.removeAll();
							Ext.dsScenario.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
			     													"and flightsession='"+Ext.cmbFlSession.value+"'";
							Ext.dsScenario.load();
		   				});
	            	}
	            },'-',
	            {text: 'Start Center',
	            	iconCls: 'add16',
				    handler: function () {launchapp('startcntr');}
	            },
	            {text: 'Reservation',
	            	iconCls: 'add16',
                    href: '',
                	handler: function () {
               			launchapp ('reservation') ;}
	            },
	            {
	            	xtype:'splitbutton',
	                text: 'Report',
	                iconCls: 'add16',
	                menu: [{text: 'Daily Flight Scheduling',
		                    href: '',
		                	handler: function () {
	                			launchapp ('configuration') ;
	                		}},
		                   {text: 'Detail Reservation Report',
	                		href: '',
		                	handler: function () {
	                			launchapp ('report2') ;
	                		}}
		                   ]
	            },
	            //{text: 'Security',
	            //	iconCls: 'add16',
				//    handler: function () {launchapp('security');}
	            //},
	            {text: 'Documentation',
	            	href: '',
	            	iconCls: 'add16',
				    //handler: function () {launchapp('documentation');}
            		handler: function () {window.open('execprocedure.jsp');}
	            },
			    /*
			     *
			     {
	                xtype:'splitbutton',
	                text: 'Start',
	                iconCls: 'add16',
	                handler: function() { launchapp('startcntr') ;  },
	                menu: [{text: 'Reservation',
		                    href: '',
		                	handler: function () {
	                			launchapp ('reservation') ;
	                		}},
		                   {text: 'Schedulling',
	                		href: '',
	                		handler: function () {launchapp('schedulling');}},
	                       {text: 'Reports',
		                		href: '',
		                		handler: function () {launchapp('reports');}},
		                	'-',
		                	{text: 'Configuration',
			                	handler: function () {launchapp('configuration');}},
			                '-',
			                {text: 'Security',
				            	handler: function () {launchapp('security');}}
		                   ]
	            },*/
	            {
	                text: 'Sign Out',
	                iconCls: 'add16',
	                handler: function() {
	            		document.location = '../login/logout.jsp' ;
	            	}
	            }]
	        })
		}

		function newScenario(btn){
	        //Ext.example.msg('Button Click', 'You clicked the {0} button', btn);
	        if(btn == 'yes'){
	        	EditorBean.makeNewScenario (function(retval, e) {
           			EditorBean.getScenario (function(retval, e) {
						Ext.scenarioId = retval ;
						Ext.cmbScenario.setValue (Ext.scenarioId) ;

						//reloadRoute();
						window.location.reload(true);
           				//Ext.example.msg('Button Click', 'New Scenario has been created.', Ext.reservedDate);

						Ext.dsReservation.baseParams['flightsession'] = '2343';
						Ext.dsReservation.reload();

						Ext.dsReservation.baseParams['flightsession'] = Ext.cmbFlSession.value;
						Ext.dsReservation.reload();
					});
           		})
	        }
	    };

	    function setupStatusBar () {
			var bbar = new Ext.ux.StatusBar({
	            id: 'basic-statusbar',
	            renderTo: 'statusbar',

	            // defaults to use when the status is cleared:
	            defaultText: 'Ready',
	            //defaultIconCls: 'default-icon',

	            // values to set initially:
	            text: 'Ready',
	            iconCls: 'x-status-valid',

	            // any standard Toolbar items:
	            items: [
			        '<%=user.getDisplayName()%>',
			        '-',
	                {
	                    text: 'Clear status',
	                    handler: function (){
	                        var sb = Ext.getCmp('basic-statusbar');
	                        // once completed
	                        sb.clearStatus();
	                    }
	                }
	            ]
	        })
	    }

	    function reloadRes(){
			var valdate = Ext.dfReservedDate.value;
			Ext.dfReservedDate.setValue(valdate);
	    }
	    
	    function myFunction()
	    {
	    alert("Thank you for visiting W3Schools!");
	    }

	    onunload = function (e) {
            purge(document.body);
        };

		Ext.onReady(function() {
			setContext ('<%=scid%>') ;

			setupMenuBar() ;
			setupStatusBar () ;

			launchapp ('<%=app%>') ;
		}) ;
		</script>
	</head>

<body onunload="myFunction">
	<div id="header">

		<div class="api-title">Helico Total</div>
  	</div>
   <div id="menubar"> </div>
   <div id="presentation"><div id="_placeholder"></div></div>
   <div id="exstatusbar"></div>
   <div id="statusbar"><a id="statustext"></a></div>

	<div id="detail-win" class="x-hidden" style="position:absolute;top:100px;">
	<div class="x-window-header">Scenarios</div>
 	<div id="detail-tabs">
    <!-- Auto create tab 1 -->
		<div class="x-tab" title="Hello World 1">
    		<p>Hello...</p>
		</div>
	<!-- Auto create tab 2 -->
        <div class="x-tab" title="Hello World 2">
            <p>... World!</p>
        </div>
    </div>
</div>



<div id="acregconfig-win" class="x-hidden">
	<div class="x-window-header">Scenarios</div>
 	<div id="acregconfig-tabs">
    <!-- Auto create tab 1 -->
		<div class="x-tab" title="Hello World 1">
    		<p>Hello...</p>
		</div>
	<!-- Auto create tab 2 -->
        <div class="x-tab" title="Hello World 2">
            <p>... World!</p>
        </div>
    </div>
</div>

</body>

</html>