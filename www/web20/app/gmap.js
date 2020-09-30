
/*!
 * Copyright(c) 2011 Talian Infodinamika, LPPM ITS
 */


// setup drag and drop zone
Ext.namespace('Ext.talian.gmap.data');

var isReassignRoute = false;
var arrVals;
Ext.refDivID = [];
Ext.arrRefCapStat = [];
Ext.arrRefStat = [];
Ext.currAcreg = '';
Ext.dtlacreg = '';
Ext.configAcreg = '';
Ext.countWhere = 5;
Ext.currAcreg2 = '';
Ext.isUnassign = false;

function drageanddropzone () {

	Ext.talian.REMOTING_API.enableBuffer = 0;
   	var remotingProvider = Ext.Direct.addProvider( Ext.talian.REMOTING_API);
   	Djn.RemoteCallSupport.addCallValidation(remotingProvider);
    Djn.RemoteCallSupport.validateCalls = true;

   	var isReservationLoaded = false ;
   	var isSummaryLoaded = false ;

   	var filters2 = new Ext.ux.grid.GridFilters({local: true, 
   	 filters:[
   				{type: 'string',  dataIndex: 'ORG'},
   				{type: 'string',  dataIndex: 'DEST'}
   		]});
   	
   	Ext.dsReservation = new Ext.data.DirectStore( {
	    paramsAsHash:false,
	    root:'data',
	    directFn: EditorBean.getReservation,
	    idProperty:'RESERVATIONID',
	    totalProperty:'totalProperty',
	    fields: [
	      {name: 'RESERVATIONID' },
	      {name: 'TRIPDATE' },
	      {name: 'FLIGHTSESSION' },
	      {name: 'RESTYPE' },
	      {name: 'DISPLAYNAME' },
	      {name: 'ORG'},
	      {name: 'DEST'},
	      {name: 'POV'},
	      {name: 'PRIORITY'},
	      {name: 'LUGGAGEWEIGHT'},
	      {name: 'PAXWEIGHT'},
	      {name: 'PAXSTATUS'}
	    ],
	    api: {
		    view: DataBean.View,
    		create: DataBean.Create,
    		update: EditorBean.UpdateReservation,
    		destroy: DataBean.Delete
    	},
	    listeners: {
	      load: function(s, records){
	        textStatus ("Loaded " + records.length + " records", true, false) ;
	      }
	    },
	    baseParams : {
		    reservedate : Ext.cDate,
			flightsession : Ext.flightSessionId,
			orderby : "priority, org, dest",
	        start : 0,
			page : 999999
	    },
	    paramOrder: 'reservedate|flightsession|orderby|start|page',
	    writer: new Ext.data.JsonWriter({
    		encode: false,
    		listful: true,
    		writeAllFields: false
    	}),
    	autoSave: true,
		paramsAsHash: false,
		handleException : function(e) {
			alert (e) ;
		}
    });

    Ext.dsAcreg = new Ext.data.DirectStore( {
	    paramsAsHash:false,
	    root:'data',
	    directFn: DataBean.getMbo,
	    idProperty:'ACREGID',
	    totalProperty:'totalProperty',
	    fields: [
	      {name: 'ACREGID' },
	      {name: 'DESCRIPTION' },
	      {name: 'ACREG' },
	      {name: 'SERIAL' },
	      {name: 'STATUS' },
	      {name: 'EEW'},
	      {name: 'MTOW'},
	      {name: 'TANKCAPACITY'},
	      {name: 'MAXSPEED'},
	      {name: 'PAXCAPACITY'},
	      {name: 'PRESENTATION'},
	      {name: 'PATHCOLOR'},
	      {name: 'STARTPOS'},
	      {name: 'ENDPOS'},
	      {name: 'REFUELPORT'}
	    ],
	    listeners: {
	      load: function(s, records){
			textStatus ("Loaded " + records.length + " records", true, false) ;
	      }
	    },
	    baseParams : {
	        start : 0,
	        limit : 10000,
	        sort : "STATUS, ACREG",
	        mboname : "ACREG",
	        where : "1=1",
	        dir : "ASC"
	    },
	    paramOrder: 'mboname|where|start|limit|sort|dir'
    });

    Ext.dsAcreg.load();

    var pager = new Ext.PagingToolbar({
        store: Ext.dsReservation,
        displayInfo: true,
        pageSize: 999999
      });

    Ext.dsReservation.load() ;

    var editor = new Ext.ux.grid.RowEditor({
    	saveText: 'update'
    });

    Ext.patientView = new Ext.grid.GridPanel( {
	    store: Ext.dsReservation,
	    height: 763,
	    width: 353,
	    stripeRows: true,
	    plugins: [editor, filters2],
	    columns: [
	      {
	        header: 'Name',
	        dataIndex: 'DISPLAYNAME',
	        width: 150
	      },
	      {
	        header: 'Org',
	        dataIndex: 'ORG',
	        sortable: true,
	        width: 50
	      },
	      {
	        header: 'Dest',
	        dataIndex: 'DEST',
	        sortable: true,
	        width: 50
	      },
	      {
	        header: 'POV',
	        dataIndex: 'POV',
	        sortable: true,
	        width: 50
	      },
	      {
	        header: 'Priority',
	        dataIndex: 'PRIORITY',
	        sortable: true,
	        width: 50,
	        editor: {
                xtype: 'combo',
                mode:           'local',
                triggerAction:  'all',
                forceSelection: true,
                editable:       false,
                displayField:   'name',
                valueField:     'value',
                store:          new Ext.data.JsonStore({
                    fields : ['name', 'value'],
                    data   : [
                        {name : 'A',   value: 'A'},
                        {name : 'B',  value: 'B'},
                        {name : 'C', value: 'C'}
                    ]
                })
            }
	      }
	      ,
	      {
	        header: 'Included?',
	        dataIndex: 'PAXSTATUS',
	        sortable: true,
	        width: 43,
	        xtype: 'booleancolumn',
	        trueText: 'Yes',
            falseText: 'No',
            editor: {
                xtype: 'checkbox'
            }
	      }
	    ],
	    bbar:pager,
	    viewConfig: {
        	forceFit:true,
        	tpl: new Ext.XTemplate( '<div class="patient-source"><table><tbody>' +
        		                    '<tr><td class="{clname}">{name}</td><td class="patient-name">{from}</td><td class="patient-name">{to}</td><td class="patient-name">{no}</td></tr>' +
        		                    '</tbody></table></div>' ),
        	cls: 'patient-view',
        	itemSelector: 'div.patient-source',
        	overClass: 'patient-over',
        	selectedClass: 'patient-selected',
        	multiSelect: true
        },
        listeners: {
            render: initializeReservationDragZone
        }
	  }) ;

    var checkColumn = new Ext.grid.CheckColumn({
       header: 'Active?',
       dataIndex: 'STATUS',
       width: 55
    });


    var editor3 = new Ext.ux.grid.RowEditor({
    	saveText: 'update'
    });
    
    function renderDetailButton (value, id, r) {
    	var id = Ext.id();
    	createGridButton3.defer(10, this, ['x', id, r]);
        // return('&lt;div id="' + id + '"&gt;&lt;/div&gt;');
    	return('<div id="' + id + '"></div>');
    }
    
    Ext.loadFn1 = function(){
        statusBar = Ext.getCmp('win-statusbar');
        statusBar.showBusy();
    };
    
    Ext.stopFn2 = function(){
      statusBar = Ext.getCmp('win-statusbar');
      statusBar.clearStatus({useDefaults:true});
  };
  
  Ext.calcTimer = function(){
	  var tempCount = Number(Ext.dsScenConf.data.items[0].data.TOTALCALCTIME) / 1000;
      Ext.fly(counterDown.getEl().parent()).addClass('x-status-text-panel').createChild({cls:'spacer'});

      // Kick off the clock timer that updates the clock el every second:
	    Ext.TaskMgr.start({
	        run: function(i){
	        	if (i <= tempCount){
	        		Ext.fly(counterDown.getEl()).update(tempCount - i);
	        	} else {
	        		//Ext.fly(counterDown.getEl()).update('0');
	        	}
	        },
	        interval: 1000
	    });
  };
    
    Ext.stopFn1 = function(){
    	statusBar = Ext.getCmp('win-statusbar');
        statusBar.clearStatus({useDefaults:true});
    	
    	EditorBean.stopAssignment();
    	
    	Ext.MessageBox.show({
	           msg: 'Saving your data, please wait...',
	           progressText: 'Saving...',
	           width:300,
	           wait:true,
	           waitConfig: {interval:200},
	           icon:'ext-mb-download', //custom class in msg-box.html
	           animEl: 'mb7'
	       });
		 
		 setTimeout(function(){
	            Ext.MessageBox.hide();
	        }, 15000);
    	
		Ext.out.append ('Automatic Schedulling has been Terminated');
		Ext.out.append ('Saving...');
		Ext.pollProvider.disconnect() ;
		
		Ext.countWhere++;
		Ext.dsScenario.removeAll();
//		Ext.dsScenario.removed.length = 0;
		Ext.dsScenario.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
		"and flightsession='"+Ext.flightSessionId+"' and "+Ext.countWhere+"="+Ext.countWhere;
		Ext.dsScenario.load();
		
		
		
//		win.hide();
    };
    
    var counterDown = new Ext.Toolbar.TextItem('');
    var text1 = new Ext.Toolbar.TextItem('Calculation will be finished in: ');
    
    Ext.win = new Ext.Window({
        title: 'Calculation Progress Window',
        width: 550,
        minWidth: 400,
        height: 300,
        modal: true,
        closable: false,
        closeAction: 'hide',
        bodyStyle: 'padding:10px;',
        items:[
            new Ext.form.DisplayField({
		        id: 'out',
		        layout: 'fit'
        })
        ],
        bbar: new Ext.ux.StatusBar({
            id: 'win-statusbar',
            defaultText: '.',
            busyText: '.',
            items: [text1, counterDown, ' sec','-',{
                id: 'win-button-stop',
                text: 'Stop Loading',
                handler: Ext.stopFn1
            }, '-' ,
            {
                id: 'win-button-close',
                text: 'Close',
                handler: function(){
            		try {
            			Ext.countWhere++;
            			Ext.dsScenario.removeAll();
            			Ext.dsScenario.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
            			"and flightsession='"+Ext.flightSessionId+"' and "+Ext.countWhere+"="+Ext.countWhere;
            			Ext.dsScenario.load();
            			Ext.win.hide();
            		}
            		catch (e) {
            			
            		}
                }
            }]
        }),
        listeners: {
            render: {
                fn: function(){
                	var tempCount2 = Number(Ext.dsScenConf.data.items[0].data.TOTALCALCTIME) / 1000;
                    Ext.fly(counterDown.getEl().parent()).addClass('x-status-text-panel').createChild({cls:'spacer'});

                    // Kick off the clock timer that updates the clock el every second:
				    Ext.TaskMgr.start({
				        run: function(i){
				        	if (i <= tempCount2){
				        		Ext.fly(counterDown.getEl()).update(tempCount2 - i);
				        	} else {
				        		//Ext.fly(counterDown.getEl()).update('0');
				        	}
				        },
				        interval: 1000
				    });
                },
                delay: 100
            }
        }
    });


    Ext.fleetGrid = new Ext.grid.GridPanel({
    	id: 'fleetGrid',
        title: 'Fleet Assignment',
        region: 'east',
        height: 790,
        margins: '0 2 2 0',
        tbar: [
		{
			text: ' Calculate',
			iconCls: 'calculate',
			handler: function() {
				EditorBean.isAutoAssignmentRunning(function(retval, e) {
					if (retval == false) {   // not running
						Ext.out.reset();
						Ext.pollProvider.connect();
						Ext.loadFn1();

						EditorBean.autoAssignment ("TRUE", function(retval, e) {
							var result = retval['result'];
							Ext.example.msg(result);
						}) ;
					}
					else {
					    Ext.example.msg('Automatic Assignment has been running') ;
					}
				}) ;
				
				Ext.win.show();
//				loadFn1.createCallback('win-button-start', 'win-statusbar');

//				Ext.winLogs.show(this);
//				var dom = Ext.get('scenlogs');
//				dom.applyStyles("position:absolute;top:100px;");
//
//				var domShadow = Ext.query('.x-ie-shadow');
//				Ext.get(domShadow).applyStyles("top:100px;");
//
//				showLoadFn('pBar');
			}
		}, '-', {
            text: ' Scenario',
			iconCls: 'scenariolist',
            handler: function() {
				Ext.countWhere++
				Ext.dsFlightScenarioGr.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j'))
															+"' } and flightsession='"+Ext.flightSessionId+"' and "
															+ Ext.countWhere+"="+Ext.countWhere ,
				Ext.dsFlightScenarioGr.reload();
        		Ext.winScenario.show(this);
            }
        }, '-', {
        	text: ' Configuration',
			iconCls: 'basic',
        	handler: function() {
        		Ext.winScenConf.show(this);
        	}
        }, '-', {
        	text: ' Synchronize with PTS',
			iconCls: 'synchs',
        	handler: function() {
        		EditorBean.callOracleProcedure (function(retval, e) {
        			Ext.Msg.alert('Synchronization Result', retval=1 ? 'Success' : 'Failed');
				});
        	}
        }],
        columns: [ {
            dataIndex: 'ACREG',
            header: 'Reg No',
            width: 50
        },{
        	id: 'acregstat',
        	dataIndex:'STATUS',
        	header: 'Is Active?',
        	width: 70
        },{
        	dataIndex:' ',
        	header: 'Trip Time',
        	width: 70
        },{
			dataIndex: ' ',
            header: ' ',
			sortable: false,
            width: 40,
            renderer: renderDetailButton
		},{
			dataIndex: ' ',
            header: ' ',
			sortable: false,
            width: 40,
            renderer: renderConfigButton
		},{
			dataIndex: ' ',
            header: ' ',
			sortable: false,
            width: 40,
			renderer: renderOptimizeButton
		},{
			dataIndex: ' ',
            header: ' ',
			sortable: false,
            width: 40,
			renderer: renderCraftButton
		},{
			dataIndex: ' ',
            header: ' ',
			sortable: false,
            width: 40,
			renderer: renderSwitchButton
		},{
			dataIndex: ' ',
            header: ' ',
			sortable: false,
            width: 150,
			renderer: renderAddReportCommentButton
		}
		/*, {
            dataIndex: 'startpos',
            header: 'Start Position',
            width: 100
        }, {
            dataIndex: 'endpos',
            header: 'End Position',
            width: 100
        }, {
            dataIndex: 'fuel',
            header: 'Fuel',
            width: 100
        }, {
            dataIndex: 'payload',
            header: 'Pay Load',
            width: 100
        }, {
            dataIndex: 'svctime',
            header: 'Svc Time',
            width: 100
        }*/],
        viewConfig: {
            tpl: new Ext.XTemplate('<div class="hospital-target" >'+
										'<div style="border:1px solid {PATHCOLOR};width:515px;height:115px;margin:0px;padding:0px">' +
											'<table><tbody><tr>' +
											'<td width="350px">' +
												'<table class="{PATHCOLOR}" cellPadding=0; cellSpacing=0><tbody>' +
													'{PRESENTATION}'+
												'</tbody></table>' +
											'</td>'	+
											'</tr></tbody></table>' +
										'</div>' +
            		               '</div>', {compiled: true}),
            enableRowBody: true,
            getRowClass: function(rec, idx, p, store) {
                p.body = this.tpl.apply(rec.data);
            }
        },
        store: Ext.dsAcreg,
        listeners: {
            render: initializeHospitalDropZone
        }
    });

    new Ext.Viewport({
        layout: 'border',
        applyTo: 'data1_canvas',
        items: [ {
            title: 'Reservation',
            region: 'west',
            width: 353,
            height: 790,
            margins: '0 0 0 0',
            items: Ext.patientView
        }]
    });

    new Ext.Viewport({
        layout: 'border',
        applyTo: 'data2_canvas',
        items: [ {
        	region: 'center',
        	width: 544,
        	height: 790,
        	margins: '0 0 0 0',
            items: Ext.fleetGrid
        }]
    });
}

	Ext.dsAcreg3 = new Ext.data.DirectStore( {
	    paramsAsHash:false,
	    root:'data',
	    directFn: DataBean.getMbo,
	    idProperty:'ACREGID',
	    totalProperty:'totalProperty',
	    fields: [
	      {name: 'ACREGID' },
	      {name: 'DESCRIPTION' },
	      {name: 'ACREG' },
	      {name: 'SERIAL' },
	      {name: 'STATUS' },
	      {name: 'EEW'},
	      {name: 'MTOW'},
	      {name: 'TANKCAPACITY'},
	      {name: 'MAXSPEED'},
	      {name: 'PAXCAPACITY'},
	      {name: 'PRESENTATION'},
	      {name: 'PATHCOLOR'},
	      {name: 'STARTPOS'},
	      {name: 'ENDPOS'},
	      {name: 'REFUELPORT'}
	    ],
	    listeners: {
	      load: function(s, records){
			textStatus ("Loaded " + records.length + " records", true, false) ;
	      }
	    },
	    baseParams : {
	        start : 0,
	        limit : 10000,
	        sort : "ACREGID",
	        mboname : "ACREG",
	        where : "status='ACTIVE'",
	        dir : "ASC"
	    },
	    paramOrder: 'mboname|where|start|limit|sort|dir'
    });

    Ext.dsAcreg3.load();

   	Ext.dsAssignedReservation = new Ext.data.DirectStore( {
	    paramsAsHash:false,
	    root:'data',
	    directFn: EditorBean.getAssignedReservation,
	    idProperty:'RESERVATIONID',
	    totalProperty:'totalProperty',
	    fields: [
	      {name: 'RESERVATIONID' },
	      {name: 'TRIPDATE' },
	      {name: 'FLIGHTSESSION' },
	      {name: 'RESTYPE' },
	      {name: 'DISPLAYNAME' },
	      {name: 'ORG'},
	      {name: 'DEST'},
	      {name: 'POV'},
	      {name: 'PRIORITY'},
	      {name: 'LUGGAGEWEIGHT'},
	      {name: 'PAXWEIGHT'},
	      {name: 'PAXSTATUS'}
	    ],
	    listeners: {
	      load: function(s, records){
	        textStatus ("Loaded " + records.length + " records", true, false) ;
	      }
	    },
	    baseParams : {
			acreg : 'PK-TPZ'

	    },
	    paramOrder: 'acreg'
    });

   	Ext.dsAssignedReservation.load();

    Ext.dsScenConf = new Ext.data.DirectStore( {
	    paramsAsHash:false,
	    root:'data',
	    directFn: DataBean.getMbo,
	    idProperty:'SCENARIOCONFIGID',
	    totalProperty:'totalProperty',
	    fields: [
	      {name: 'SCENCONFIGID' },
	      {name: 'SCENARIOID' },
	      {name: 'STARTPOS' },
	      {name: 'ENDPOS' },
	      {name: 'OAT'},
	      {name: 'CREWWEIGHT'},
	      {name: 'CONTIGENCY'},
	      {name: 'HEADWIND'},
	      {name: 'TOTALCALCTIME'},
	      {name: 'NBESTSCENARIO'}
	    ],
	    listeners: {
	      load: function(s, records){
			textStatus ("Loaded " + records.length + " records", true, false) ;
			Ext.scenconfCW.setValue(Ext.dsScenConf.data.items[0].data.CREWWEIGHT);
			Ext.scenconfOAT.setValue(Ext.dsScenConf.data.items[0].data.OAT);
        	Ext.scenconfHW.value = Ext.dsScenConf.data.items[0].data.HEADWIND;
        	Ext.scenconfTT.setValue(Ext.dsScenConf.data.items[0].data.TOTALCALCTIME);
        	Ext.scenconfTS.value = Ext.dsScenConf.data.items[0].data.NBESTSCENARIO;
	      }
	    },
	    baseParams : {
	        start : 0,
	        limit : 10000,
	        sort : "SCENCONFIGID",
	        mboname : "SCENCONFIG",
	        where : "scenconfigid = 0 and scenarioid is null",
	        dir : "ASC"
	    },
	    paramOrder: 'mboname|where|start|limit|sort|dir'
    });

    Ext.dsScenConf.load();
    
	Ext.dsTambahComment = new Ext.data.DirectStore( {
	    paramsAsHash:false,
	    root:'data',
	    directFn: EditorBean.getScenarioAssignment,
	    idProperty:'ACREG',
	    totalProperty:'totalProperty',
	    fields: [
	      {name: 'ACREG' },
	      {name: 'REMARKS'}
	    ],
	    listeners: {
	      load: function(s, records){
	        textStatus ("Loaded " + records.length + " records", true, false) ;
	        Ext.tambahCommentAcreg.setValue(Ext.dsTambahComment.data.items[0].json.acreg);
	        Ext.tambahCommentRemarks.setValue(Ext.dsTambahComment.data.items[0].json.remarks);
	      }
	    },
	    baseParams : {
			acreg : 'PK-TPE'

	    },
	    paramOrder: 'acreg'
	});

//	Ext.dsTambahComment.load();

Ext.dsFlightScenarioGr = new Ext.data.DirectStore( {
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
	      {name: 'FLIGHTSESSION'},
	      {name: 'DESCRIPTION'},
	      {name: 'BYPLANNER'},
	      {name: 'APPROVEDATE'}
	    ],
	    listeners: {
	      load: function(s, records){
			textStatus ("Loaded " + records.length + " records", true, false) ;
	      }
	    },
	    baseParams : {
	        start : 0,
	        limit : 10000,
	        sort : "STATUS",
	        mboname : "FLIGHTSCENARIO",
	        where : "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } and flightsession='"+Ext.flightSessionId+"'",
	        dir : "ASC"
	    },
	    paramOrder: 'mboname|where|start|limit|sort|dir',
	    api: {
		    view: DataBean.View,
    		create: DataBean.Create,
    		update: DataBean.Update,
    		destroy: DataBean.Delete
    	},writer: new Ext.data.JsonWriter({
    		encode: false,
    		listful: true,
    		writeAllFields: false
    	}),
    	autoSave: true,
		paramsAsHash: false,
		handleException : function(e) {
			alert (e) ;
		}
    });

    Ext.dsFlightScenarioGr.load();

    Ext.allports = new Array();

     var editor2 = new Ext.ux.grid.RowEditor({
    	saveText: 'update'
    });
     
     editor2.on({
    	  scope: this,
    	  afteredit: function(roweditor, changes, record, rowIndex) {
    		  Ext.countWhere++;
    		  Ext.dsFlightScenarioGr.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j'))
															+"' } and flightsession='"+Ext.flightSessionId+"' and "
															+ Ext.countWhere+"="+Ext.countWhere;
    		  Ext.dsFlightScenarioGr.reload();
    	  }
    	});

	Ext.scenarioViewer = new Ext.grid.GridPanel( {
	    store: Ext.dsFlightScenarioGr,
	    width: 1600,
	    height: 1000,
	    stripeRows: true,
	    plugins: [editor2],
	    columns: [
	      {
	        header: 'ID',
	        dataIndex: 'SCENARIOID',
	        width: 25
	      },
	      {
	        header: 'Flight Session',
	        dataIndex: 'FLIGHTSESSION',
	        sortable: true,
	        width: 25
	      },
	      {
	        header: 'Reservation Date',
	        dataIndex: 'RESERVEDATE',
	        xtype: 'datecolumn',
	        format: 'd/m/Y',
	        sortable: true,
	        width: 25
	      },
	      {
	        header: 'Status',
	        dataIndex: 'STATUS',
	        sortable: true,
	        width: 25,
	        editor: {
                xtype: 'combo',
                mode:           'local',
                triggerAction:  'all',
                forceSelection: true,
                editable:       false,
                displayField:   'name',
                valueField:     'value',
                store:          new Ext.data.JsonStore({
                    fields : ['name', 'value'],
                    data   : [
                        {name : 'DRAFT',   value: 'DRAFT'},
                        {name : 'APPROVED',  value: 'APPROVED'}
                    ]
                })
            }
	      },
	      {
	        header: 'Total Minutes',
	        dataIndex: 'TOTSVCTIME',
	        sortable: true,
	        width: 25
	      },
	      {
	        header: 'Description',
	        dataIndex: 'DESCRIPTION',
	        sortable: true,
	        width: 50,
	        editor: {
                xtype: 'textfield',
                mode:           'local',
                triggerAction:  'all',
                forceSelection: true,
                editable:       false
            }
	      },
	      {
	        header: 'Approved By',
	        dataIndex: 'BYPLANNER',
	        sortable: true,
	        width: 35
	      },
	      {
	        header: 'Approved Date',
	        dataIndex: 'APPROVEDATE',
	        xtype: 'datecolumn', 
	        format: 'd/m/Y, g:i a',
	        sortable: true,
	        width: 25
	      }
	    ],
	    viewConfig: {
        	forceFit:true,
        	cls: 'patient-view',
        	itemSelector: 'div.patient-source',
        	overClass: 'patient-over',
        	selectedClass: 'patient-selected',
        	multiSelect: true
        },
        listeners: {

        },
        buttons: [{
    		text: 'Delete',
    		handler: function(){
				EditorBean.deleteFlightScenario(Ext.scenarioViewer.selModel.selections.keys.toString(), function(retval,e) {
					editor2.stopEditing();
	                var s = Ext.scenarioViewer.getSelectionModel().getSelections();
	                
	                for(var i = 0, r; r = s[i]; i++){
	                	if (Ext.scenarioViewer.getSelectionModel().selections.items[0].data.STATUS == 'DRAFT') {
		                	Ext.dsFlightScenarioGr.remove(r);
						}
	                }
	                
					Ext.dsFlightScenarioGr.load();
        			Ext.dsScenario.removeAll();
					Ext.dsScenario.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
	     													"and flightsession='"+Ext.cmbFlSession.value+"'";
					Ext.dsScenario.load();
					Ext.dsScenario.reload();
				});
    		}
    	}, {
            text: 'Close',
            handler: function(){
        		try {
        			Ext.dsFlightScenarioGr.load();
        			Ext.dsScenario.removeAll();
					Ext.dsScenario.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
	     													"and flightsession='"+Ext.cmbFlSession.value+"'";
					Ext.dsScenario.load();
					Ext.dsScenario.reload();
        			Ext.winScenario.hide();
        		}
        		catch (e) {
//        			console.log ("Error : " + e) ;
        		}
            }
        }]
	  }) ;
	
	Ext.scenconfCW = new Ext.form.NumberField({
		fieldLabel: 'Crew Weight',
		name: 'crewweight',
		width:190
	});

    Ext.scenconfOAT = new Ext.form.NumberField({
		fieldLabel: 'OAT',
		name: 'oat',
		width:190
	});

    Ext.scenconfHW = new Ext.form.NumberField({
		fieldLabel: 'Head Wind',
		name: 'headwind',
		width:190
	});

    Ext.scenconfTT = new Ext.form.NumberField({
		fieldLabel: 'Calculating Time (milliseconds)',
		name: 'totalcalctime',
		width:190
	});

    Ext.scenconfTS = new Ext.form.TextField({
		fieldLabel: 'Total Scenario',
		name: 'nbestscenario',
		width:190
	});

    Ext.scenConfViewer = new Ext.FormPanel({
        labelWidth: 100, // label settings here cascade unless overridden
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        width: 350,
        defaults: {width: 230},
        defaultType: 'textfield',

        items: [Ext.scenconfCW,
				Ext.scenconfOAT,
				Ext.scenconfHW,
				Ext.scenconfTT,
				Ext.scenconfTS
        ]
    });
    
    Ext.tambahCommentAcreg = new Ext.form.TextField({
	    fieldLabel: 'Acreg',
	    name: 'acreg',
	    width:190
	});

	Ext.tambahCommentRemarks = new Ext.form.TextArea({
	    fieldLabel: 'Remarks',
	    name: 'remarks',
	    width:190
	});

	Ext.tambahReportViewer = new Ext.FormPanel({
	    labelWidth: 100, 
	    frame:true,
	    bodyStyle:'padding:5px 5px 0',
	    width: 200,
	    defaults: {width: 200},
	    defaultType: 'textfield',

	    items: [Ext.tambahCommentAcreg,
	            Ext.tambahCommentRemarks
	    ]
	});

    Ext.detailResvViewer = new Ext.grid.GridPanel( {
	    store: Ext.dsAssignedReservation,
	    height: 700,
	    stripeRows: true,
	    detacreg:'',
	    columns: [
	      {
	        header: 'ID',
	        dataIndex: 'RESERVATIONID',
	        width: 60
	      },
	      {
	        header: 'Flight Session',
	        dataIndex: 'FLIGHTSESSION',
	        sortable: true,
	        width: 25
	      },
	      {
	        header: 'Name',
	        dataIndex: 'DISPLAYNAME',
	        sortable: true,
	        width: 25
	      },
	      {
	        header: 'Origin',
	        dataIndex: 'ORG',
	        sortable: true,
	        width: 25
	      },
	      {
	        header: 'Destination',
	        dataIndex: 'DEST',
	        sortable: true,
	        width: 25
	      },
	      {
	        header: 'Pax Weight',
	        dataIndex: 'PAXWEIGHT',
	        sortable: true,
	        width: 25
	      },
	      {
	        header: 'Luggage',
	        dataIndex: 'LUGGAGEWEIGHT',
	        sortable: true,
	        width: 25
	      }
	    ],
	    viewConfig: {
        	forceFit:true,
        	cls: 'patient-view',
        	itemSelector: 'div.patient-source',
        	overClass: 'patient-over',
        	selectedClass: 'patient-selected',
        	multiSelect: true
        },
        listeners: {
	      rowclick: function(g, rowidx, e){
	        textStatus ("You clicked " + rowidx + "th index", true, false) ;
	      }
	    },
	    buttons:[
	    	{
	    		text: 'Unassign',
	    		handler: function(){
					EditorBean.unassignReservation(Ext.dtlacreg, Ext.detailResvViewer.selModel.selections.keys.toString(), function(retval,e) {
						Ext.isUnassign = true;
//						console.log('is unasign: '+Ext.isUnassign);
						Ext.dsAssignedReservation.removeAll() ;
						Ext.dsAssignedReservation.load() ;
						Ext.refreshData(Ext.detailResvViewer.detacreg) ;
					});
	    		}
	    	},
	    	{
            text: 'Close',
            handler: function(){
        		try {
        			Ext.winDetailResv.hide();
        		}
        		catch (e) {
//        			console.log ("Error : " + e) ;
        		}
            }
        }
    	]
	  }) ;

	Ext.acregname = new Ext.form.TextField({
		fieldLabel: 'ACREG',
		name: 'acreg',
		width:190,
		disabled: true
	});

    Ext.startpos = new Ext.form.TextField({
		fieldLabel: 'Start Pos',
		name: 'startpos',
		width:190
	});

    Ext.endpos = new Ext.form.TextField({
		fieldLabel: 'End Pos',
		name: 'endpos',
		width:190
	});

    Ext.paxcapacity = new Ext.form.TextField({
		fieldLabel: 'Pax Capacity',
		name: 'paxcapacity',
		width:190
	});

    Ext.refuelport = new Ext.form.TextField({
		fieldLabel: 'Refueling Port',
		name: 'refuelport',
		width:190
	});

    Ext.acregstatus = new Ext.form.ComboBox({
		fieldLabel: 'Status',
		name: 'status',
		width:190,
		displayField:'value',
        valueField:     'name',
		mode: 'local',
		triggerAction: 'all',
		typeAhead: true,
		store:  new Ext.data.SimpleStore({
            fields : ['name', 'value'],
            data   : [
                ['ACTIVE', 'Active'],
                ['INACTIVE', 'Inactive']
            ]
        })
	});

	Ext.fpTest = new Ext.FormPanel({
		fileUpload: true,
		width: 500,
		autoHeight: true,
		bodyStyle: 'padding: 10px 10px 0 10px;',
		labelWidth: 100,
		paramOrder: ['acreg'],
		defaults: {
			anchor: '95%',
			allowBlank: false,
			msgTarget: 'side'
		},
		api: {
			load: EditorBean.loadAcregForm,
			submit: EditorBean.submitAcregForm
		},
		items: [{
					xtype: 'textfield',
					fieldLabel: 'ACReg',
					name: 'acreg',
					style : {textTransform: "uppercase"},
					listeners:{
				        change: function(field, newValue, oldValue){
				                       field.setValue(newValue.toUpperCase());
				                  }
				    },
					width: 50
				},
				{
					xtype: 'textfield',
					fieldLabel: 'Start Pos',
					name: 'startpos',
					style : {textTransform: "uppercase"},
					listeners:{
				        change: function(field, newValue, oldValue){
				                       field.setValue(newValue.toUpperCase());
				                  }
				    },
					width: 190
				},
				{
					xtype: 'textfield',
					fieldLabel: 'End Pos',
					name: 'endpos',
					style : {textTransform: "uppercase"},
					listeners:{
				        change: function(field, newValue, oldValue){
				                       field.setValue(newValue.toUpperCase());
				                  }
				    },
					width: 190
				},
				{
					xtype: 'numberfield',
					fieldLabel: 'Pax Capacity',
					name: 'paxcapacity',
					width: 190
				},
				{
					xtype: 'textfield',
					fieldLabel: 'Refuel Port',
					name: 'refuelport',
					style : {textTransform: "uppercase"},
					listeners:{
				        change: function(field, newValue, oldValue){
				                       field.setValue(newValue.toUpperCase());
				                  }
				    },
					allowBlank: true,
					width: 190
				},
				{
					id: 'acregconfstat',
					xtype: 'combo',
					fieldLabel: 'Status',
					name: 'status',
					displayField:'name',
			        valueField: 'value',
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					store:  new Ext.data.SimpleStore({
			            fields : ['name', 'value'],
			            data   : [
			                ['ACTIVE', 'Active'],
			                ['INACTIVE', 'Inactive']
			            ]
			        })
				}
			],
		buttons: [{
			text: 'Save',
			handler: function(){
				if(Ext.fpTest.getForm().isValid()){
					Ext.fpTest.getForm().submit({
						waitMsg: 'Saving Fleet Cofiguration...',
						success: function(fp, o) {
							Ext.example.msg('Success', 'Configuration saved');
//							Ext.fpTest.record.data.STATUS = Ext.fpTest.getComponent('acregconfstat').getValue();
//							Ext.fleetGrid.getComponent('acregstat')
//							Ext.fleetGrid.store.data.items[0].data.STATUS = Ext.fpTest.getComponent('acregconfstat').getValue();
//							var test = Ext.fleetGrid.store.data.items[0].data.STATUS;
//							Ext.dsAcreg.reload();
//							var vconfig = Ext.fleetGrid.getView() ;
//							vconfig.refresh();
							Ext.countWhere++;
							Ext.dsAcreg.removeAll();
							Ext.dsAcreg.baseParams['where'] = Ext.countWhere+"="+Ext.countWhere;
							Ext.dsAcreg.load();
						}
					});
				}
			}
		}, {
			text: 'Close',
			handler: function(){
				Ext.winAcregConf.hide();
			}
		}]
	});

	Ext.loadSwitchFn = function(btn, statusBar){
	    btn = Ext.getCmp(btn);
	    statusBar = Ext.getCmp(statusBar);
	    btn.disable();
	    statusBar.showBusy();
	    if(Ext.scenConfViewer.getForm().isValid()){
			EditorBean.switchFlight(
				Ext.fpSwitchFlight.getForm().el.dom[0].value.toString(),
				Ext.fpSwitchFlight.getForm().el.dom[1].value.toString(),
				function(){
			        statusBar.clearStatus({useDefaults:true});
			        btn.enable();

					EditorBean.selectScenario (Ext.cmbScenario.value, function(retval, e) {
							Ext.scenarioId = Ext.cmbScenario.getValue();
							Ext.isReloadScenario = true;
							reloadRoute();
					});
			    }
			);
		};
	};
	
	Ext.fpSwitchFlight = new Ext.FormPanel({
		fileUpload: true,
		width: 500,
		autoHeight: true,
		bodyStyle: 'padding: 10px 10px 0 10px;',
		labelWidth: 100,
		paramOrder: ['acreg'],
		defaults: {
			anchor: '95%',
			allowBlank: false,
			msgTarget: 'side'
		},
		api: {
			load: EditorBean.loadAcregForm,
			submit: EditorBean.submitAcregForm
		},
		items: [{
					xtype: 'textfield',
					fieldLabel: 'ACReg',
					name: 'acreg',
					style : {textTransform: "uppercase"},
					listeners:{
				        change: function(field, newValue, oldValue){
				                       field.setValue(newValue.toUpperCase());
				                  }
				    },
					width: 10
				},
				{
					id: 'switchflightto',
					xtype: 'combo',
					fieldLabel: 'Switch to Flight: ',
					name: 'switchto',
					displayField:'ACREG',
			        valueField: 'ACREG',
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					store:  Ext.dsAcreg3
				}
			],
		buttons: [{
			id: 'switchSave',
			text: 'Save',
			handler: function(){
				Ext.loadSwitchFn('switchSave', 'switchStatusBar');
			}
		}, {
			text: 'Close',
			handler: function(){
				Ext.winSwitchFlight.hide();
			}
		}],
        bbar: new Ext.ux.StatusBar({
            id: 'switchStatusBar',
            defaultText: 'Success',
            text: 'Ready',
            iconCls: 'x-status-valid'
        })
	});
	
	Ext.loadAddCommentFn = function(btn, statusBar){
	    btn = Ext.getCmp(btn);
	    statusBar = Ext.getCmp(statusBar);
	    btn.disable();
	    statusBar.showBusy();
	    if(Ext.winTambahComment.items.itemAt(0).getForm().isValid()){
			EditorBean.addReportComment(
				Ext.tambahCommentAcreg.getValue(),
	            Ext.tambahCommentRemarks.getValue(),
				function(){
			        statusBar.clearStatus({useDefaults:true});
			        btn.enable();
			    }
			);
		};
	};
	
    Ext.acregConfViewer = new Ext.FormPanel({
    	name: 'acregConfiguration',
        labelWidth: 75, // label settings here cascade unless overridden
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        width: 350,
        defaults: {width: 230},
        defaultType: 'textfield',
        formUpload: true,
		paramsAsHash: false,
        items: [{
					xtype: 'fileuploadfield',
					id: 'form-file',
					emptyText: 'Select an XLS file',
					fieldLabel: 'File',
					name: 'xls-path',
					buttonText: 'Browse...',
					buttonCfg: {
						iconCls: 'upload-icon'
					}
				},
				Ext.acregname,
				Ext.startpos,
				Ext.endpos,
				Ext.paxcapacity,
				Ext.refuelport,
				Ext.acregstatus
        ],
		api: {
        	load: EditorBean.loadAcregForm,
			submit: EditorBean.submitAcregForm
		},
		paramOrder: ['acreg'],
//		success: function(fp, o) {
//			msg('Success', 'Load data success');
//		},
        buttons: [{
            text:'Save',
			handler: function(){
				if(Ext.acregConfViewer.getForm().isValid()){
					Ext.acregConfViewer.getForm().submit({
						waitMsg: 'Saving Configuration...',
						success: function(fp, o) {
							msg('Success', 'Configuration Saved');
						}
					});
				}
			}
        },{
            text: 'Close',
            handler: function(){
        		try {
        			Ext.winAcregConf.hide();
        		}
        		catch (e) {
//        			console.log ("Error : " + e) ;
        		}
            }
        }]
    });

    Ext.acregConfViewer.getForm().load({
		params: {
			acreg: Ext.configAcreg
		}
	});

function renderDetailButton (value, id, r) {
	var id = Ext.id();
	createGridButton3.defer(10, this, ['x', id, r]);
    // return('&lt;div id="' + id + '"&gt;&lt;/div&gt;');
	return('<div id="' + id + '"></div>');
}

function createGridButton3(value, id, record) {
	new Ext.Button({
		text: '',
		tooltip: 'detail of Assigned Reservations from ACREG',
		width: 30,
		iconCls: 'details',
		acreg: record.data.ACREG,
		handler : function() {
			Ext.currAcreg2 = record.data.ACREG;
    		Ext.dsAssignedReservation.baseParams['acreg'] = record.data.ACREG;
    		Ext.dsAssignedReservation.reload();
    		Ext.dtlacreg = record.data.ACREG;
			Ext.detailResvViewer.detacreg = this.acreg;
    		Ext.winDetailResv.show(this);
        }
	}).render(document.body, id);
}


function renderConfigButton (value, id, r) {
	var id = Ext.id();
	createGridButton4.defer(10, this, ['x', id, r]);
	return('<div id="' + id + '"></div>');
}

function createGridButton4(value, id, record) {
	new Ext.Button({
		text: '',
		tooltip: 'Acreg Configurations',
		width: 30,
		iconCls: 'configs',
		handler : function() {
			Ext.configAcreg = record.data.ACREG;
			Ext.fpTest.record = record ;
			Ext.fpTest.getForm().load({
				params: {
					acreg: Ext.configAcreg
				}
			});
    		Ext.winAcregConf.show(this);
        }
	}).render(document.body, id);
}

function renderSwitchButton (value, id, r) {
	var id = Ext.id();
	createGridButton5.defer(10, this, ['x', id, r]);
	return('<div id="' + id + '"></div>');
}

function createGridButton5(value, id, record) {
	new Ext.Button({
		text: '',
		tooltip: 'Switch Flight',
		width: 30,
		iconCls: 'switchs',
		handler : function() {
			Ext.configAcreg = record.data.ACREG;
			Ext.fpSwitchFlight.record = record ;
			Ext.fpSwitchFlight.getForm().load({
				params: {
					acreg: Ext.configAcreg
				}
			});
			Ext.winSwitchFlight.show(this);
        }
	}).render(document.body, id);
}

function renderAddReportCommentButton (value, id, r) {
	var id = Ext.id();
	createGridButton6.defer(10, this, ['x', id, r]);
	return('<div id="' + id + '"></div>');
}

function createGridButton6(value, id, record) {
	new Ext.Button({
		text: '',
		tooltip: 'Add Comment to Report',
		width: 30,
		iconCls: 'comments',
		handler : function() {
			Ext.configAcreg = record.data.ACREG;
			Ext.dsTambahComment.baseParams['acreg'] = record.data.ACREG;
			Ext.dsTambahComment.load();
			Ext.winTambahComment.show(this);
        }
	}).render(document.body, id);
}

function renderCraftButton (value, id, r) {
	var id = Ext.id();
	createGridButton.defer(10, this, ['x', id, r]);
    // return('&lt;div id="' + id + '"&gt;&lt;/div&gt;');
	return('<div id="' + id + '"></div>');
}

function createGridButton(value, id, record) {
	new Ext.Button({
		text: '',
		tooltip: 'Delete Assigned Reservations from ACREG',
		width: 30
		,iconCls: 'deletes'
		,handler : function(btn, e) {
			var NOT_ASSIGNED ;
			var assignment = record.data.ACREG ;
            var revassignment = [] ;
            var newassignment = [] ;
			var deleteidx = 0;
			var v = Ext.fleetGrid.getView() ;

			Ext.example.msg('Delete Fleet Assignment', 'Deleting assignment for {0}', record.data.ACREG) ;
			EditorBean.clearAssignment(record.data.ACREG) ;
			for (i=0; i<record.data.legs.length; i++) {
				record.data.legs[i].overlay.remove() ;
			}

			for (var i=0; i<Ext.dsAcreg.data.items.length; i++) {
				var el = v.getRow(i) ;
				var rowIndex = v.findRowIndex(el);
		        var h = Ext.dsAcreg.getAt(rowIndex);

		        if(Ext.dsAcreg.data.items == assignment){
					deleteidx(rowIndex);
		        }
			}

			record.data.assignment = null ;
			record.data.revassignment = null ;

			record.data.fuel = 0 ;
			record.data.assignment = [] ;
			record.data.revassignment = [] ;
			//rowindex, assignment, fuelarray, fuelneed, paxon, paxoff, cls, pobval, wobval, isrefuelingcap, isrefuelingstat

			record.data.PRESENTATION = generateLoadTable(deleteidx, record.data.fuelval, record.data.assignment, record.data.fuelarray, record.data.fuelneed, record.data.paxon, record.data.paxoff, record.data.PATHCOLOR, record.data.pobval, record.data.wobval, record.data.isrefuelingcap, record.data.refuelingstatus ) ;

			record.commit () ;

			Ext.patientView.store.reload() ;
		}
	}).render(document.body, id);
}

function renderOptimizeButton (value, id, r) {
	var id = Ext.id();
	createOptimizeButton.defer(10, this, ['x', id, r]);
    // return('&lt;div id="' + id + '"&gt;&lt;/div&gt;');
	return('<div id="' + id + '"></div>');
}

function createOptimizeButton(value, id, record) {
	new Ext.Button({
		text: '',
		tooltip: 'Optimize Route',
		width: 30,
		rowindex: -1
		,iconCls: 'tsp'
		,handler : function(btn, e) {
			Ext.example.msg('Optimizing', 'Optimizing Route for {0}', record.data.ACREG) ;
			var v = Ext.fleetGrid.getView() ;
			for (var i=0; i<Ext.dsAcreg.data.items.length; i++) {
				var el = v.getRow(i) ;
				var ri = v.findRowIndex(el);
				var h = Ext.dsAcreg.getAt(ri);

				if(record.data.ACREG == h.data.ACREG){
					this.rowindex = ri ;
					break ;
				}
			}

			if (this.rowindex>=0) {
				EditorBean.optimizeRoute (record.data.ACREG, this.rowindex, function(retval,e) {
					updateFleetAssignment(retval, e, record, ri);
				}) ;
			}
		}
	}).render(document.body, id);
}


function subGPoints(a,b) {
  return new GPoint(a.x-b.x, a.y-b.y);
}

function gmap2div (latlng) {
	var TlcLatLng = Ext.gmap.fromContainerPixelToLatLng(new GPoint(0,0),true);
	var TlcDivPixel = Ext.gmap.fromLatLngToDivPixel(TlcLatLng);
	var pointDivPixel = Ext.gmap.fromLatLngToDivPixel(latlng);
	return subGPoints(pointDivPixel, TlcDivPixel);
}

function draw_curve (port1, port2, pathcol, isbidirection) {
	var port1pos = Ext.portarray[port1] ;
	var port2pos = Ext.portarray[port2] ;

	var pts1 = new Array();
	var color ;
	pts1.push (new GLatLng(port1pos.lat,port1pos.lng));
	pts1.push (new GLatLng(port2pos.lat,port2pos.lng));

	if (pathcol == 'red') {
		color = 'red';
	} else if (pathcol == 'green') {
		color = 'green';
	} else if (pathcol == 'blue') {
		color = 'blue';
	} else if (pathcol == 'teal') {
		color = '#009999';
	} else if (pathcol == 'brown') {
		color = '#992600';
	} else if (pathcol == 'orange') {
		color = '#ff3300';
	} else if (pathcol == 'purple') {
		color = '#4c0072	';
	} else if (pathcol == 'pink') {
		color = '#cc0099';
	} else if (pathcol == 'black') {
		color = 'black';
	}

	var poly1 = new BDCCArrowedPolyline(pts1,color,4,0.5,null,30,7,color,2,0.7,isbidirection);
	poly1.port1 = port1 ;
	poly1.port2 = port2 ;

 	Ext.gmap.addOverlay(poly1);
	return poly1 ;
}

function draw_assignment (startport, data) {
//	console.log('draw assignment start');
	draw_assignment_v1 (startport, data) ;
//	console.log('draw assignment end');
}

function draw_assignment_v1 (startport, data) {
	var assignment = data.assignment ;
	var pathcolor = data.PATHCOLOR ;
	var legs = [] ;
	var NOT_DEFINED ;

	if (typeof(data.legs)!='undefined')
		legs = data.legs ;

//	console.log('assignment: '+assignment);
	if(assignment != null){
		var isbidirection = false ;
		startpos = startport ;
		if (assignment.length==3 && assignment[0]==assignment[2]) {
			isbidirection = true ;
			maxidx = 2 ;
		}else
			maxidx =assignment.length ;

		if (assignment.length>0)
			startpos = assignment[0] ;

//		console.log('maxidx: '+maxidx);
		for (i=1;i<maxidx;i++) {
			leg = legs[i-1] ;
			dontdraw = false ;
			if (typeof(leg) != 'undefined') {
				if (leg.org != startpos || leg.dest != assignment[i]
					|| (assignment.length > 3 && (assignment[0]==assignment[assignment.length-1]))) {
					leg.overlay.remove () ;
					leg.overlay = NOT_DEFINED;
				}
				else
					dontdraw = true ;
			}
			else {
				leg = new Object() ;
				legs[i-1] = leg ;
			}

			if (!dontdraw) {
//				console.log('draw curve: '+startpos);
				leg.overlay = draw_curve(startpos, assignment[i], pathcolor, isbidirection) ;
				leg.org = startpos ;
				leg.dest = assignment[i] ;
		    }

			startpos = assignment[i];
		}

		data.legs = legs ;
	}
}

function draw_assignment_v0 (startport, assignment, pathcolor) {
    var isbidirection = false ;
	if (assignment.length == 1)  {  // set bidirection
		isbidirection = true ;
	}
	else if (assignment.length == 2) {
		if (typeof(assignment[0].overlay) != 'undefined' && assignment[0].overlay.isbidirection) {
			port1 = assignment[0].overlay.port1 ;
			port2 = assignment[0].overlay.port2 ;

			assignment[0].overlay.remove () ;
			assignment[0].overlay = draw_curve(port1, port2, pathcolor, false) ;
		}
	}

	if (typeof(assignment[0].returnpath) != 'undefined')
		assignment[0].returnpath.remove () ;

	assignment[assignment.length-1].overlay = draw_curve(startport, assignment[assignment.length-1].data.DEST, pathcolor, isbidirection) ;

	// draw return path
	if (assignment.length > 1) {
		port1 = assignment[assignment.length-1].data.DEST ;
		port2 = assignment[0].overlay.port1 ;					// assume always return to base
		assignment[0].returnpath = draw_curve(port1, port2, pathcolor, false) ;
	}
}


/*
 * Here is where we "activate" the DataView.
 * We have decided that each node with the class "patient-source" encapsulates a single draggable
 * object.
 *
 * So we inject code into the DragZone which, when passed a mousedown event, interrogates
 * the event to see if it was within an element with the class "patient-source". If so, we
 * return non-null drag data.
 *
 * Returning non-null drag data indicates that the mousedown event has begun a dragging process.
 * The data must contain a property called "ddel" which is a DOM element which provides an image
 * of the data being dragged. The actual node clicked on is not dragged, a proxy element is dragged.
 * We can insert any other data into the data object, and this will be used by a cooperating DropZone
 * to perform the drop operation.
 */
function initializeReservationDragZone(v) {
    v.dragZone = new Ext.dd.DragZone(v.getEl(), {

//      On receipt of a mousedown event, see if it is within a draggable element.
//      Return a drag data object if so. The data object can contain arbitrary application
//      data, but it should also contain a DOM element in the ddel property to provide
//      a proxy to drag.
        getDragData: function(e) {
            var sourceEl = e.getTarget(v.itemSelector, 10);
            if (sourceEl) {
                d = sourceEl.cloneNode(true);
                d.id = Ext.id();
            	var rowIndex = v.getView().findRowIndex(sourceEl);
                var h = v.getStore().getAt(rowIndex);
				var sm=Ext.patientView.getSelectionModel();
                var sel=sm.getSelections();
                if (sel.length>1)
                	d.innerHTML = '(' + sel.length + ') reservations' ;
                else
                	d.innerHTML = h.data.DISPLAYNAME + '(' + h.data.ORG+ '-' +h.data.DEST + ')' ;

                return v.dragData = {
                    sourceEl: sourceEl,
                    repairXY: Ext.fly(sourceEl).getXY(),
					selections: sel,
                    ddel: d,
                    patientData: h.data,
                    recData: h
                }
            }
        },

//      Provide coordinates for the proxy to slide back to on failed drag.
//      This is the original XY coordinates of the draggable element.
        getRepairXY: function() {
            return this.dragData.repairXY;
        }
    });
}

function switchNextVal(current, rowindex, colindex) {
    var h = Ext.fleetGrid.getStore().getAt(rowindex);
    var arrPort = h.data.assignment;
    var temp = arrPort[colindex];
    arrPort[colindex] = arrPort[colindex+1];
    arrPort[colindex+1] = temp;
		EditorBean.rearrangeRoute(h.data.ACREG,arrPort,function(retval, e) {
		updateFleetAssignment(retval, e, h, rowindex);
	})
}

function switchPrevVal(current, rowindex, colindex) {
var h = Ext.fleetGrid.getStore().getAt(rowindex);
    var arrPort = h.data.assignment;
    var temp = arrPort[colindex];
    arrPort[colindex] = arrPort[colindex-1];
    arrPort[colindex-1] = temp;
		EditorBean.rearrangeRoute(h.data.ACREG,arrPort,function(retval, e) {
		updateFleetAssignment(retval, e, h, rowindex);
	})
}

function generateLoadTable (rowindex, fuelvalidity,assignment, fuelarray, fuelneed, paxon, paxoff, cls,
                            pobval, wobval, isrefuelingcap, isrefuelingstat,
	            			curtow, maxfuelupload, paxonoff, maxpayload, curpayload, weightonboard, tankcapacity) {
	var tmpl = '<td class="{1}">{0}</td>' ;
	//var tmpl2 = '<td class="{0}"><div id="testref"></div></td>' ;
	var tmplhdr = '<th id="{1}" class="'+cls+'" >'+
	'<ul id="switch">' +
	'	<li id="left" onclick="switchPrevVal(this, {2}, {4});">{0}</li>' +
	'	<li id="center"><div id="{3}"></div></li>' +
	'	<li id="right" onclick="switchNextVal(this, {2}, {4});"></li></th>' ;
	var tmplhdrnoswitch = '<th id="{1}" class="'+cls+'" >'+
	'<ul id="switch">' +
	'	<li id="noleft" >{0}</li>' +
	'	<li id="center"></li>' +
	'	<li id="noright" ></li></th>' ;
	var tmplhdronlyleft = '<th id="{1}" class="'+cls+'" >'+
	'<ul id="switch">' +
	'	<li id="left" onclick="switchPrevVal(this, {2}, {4});">{0}</li>' +
	'	<li id="center"><div id="{3}"></div></li>' +
	'	<li id="noright" ></li></th>' ;
	var tmplhdronlyright = '<th id="{1}" class="'+cls+'" >'+
	'<ul id="switch">' +
	'	<li id="noleft" >{0}</li>' +
	'	<li id="center"><div id="{3}"></div></li>' +
	'	<li id="right" onclick="switchNextVal(this, {2}, {4});"></li></th>' ;
	var tmplspc = '<td class="'+cls+'">&nbsp</td>' ;
	var tmplhdrspc = '<th class="'+cls+'">&nbsp</th>' ;
	var tmplhdrdesc = '<th class="'+cls+'desc">&nbsp</th>' ;
	var tmpldesc1 = '<td class="'+cls+'desc">Take Off Weight</td>' ;
	var tmpldesc2 = '<td class="'+cls+'desc">Min Fuel On Board</td>' ;
	var tmpldesc3 = '<td class="'+cls+'desc">Current Payload</td>' ;
	var tmpldesc4 = '<td class="'+cls+'desc">Allowance Payload</td>' ;
	var tmpldesc5 = '<td class="'+cls+'desc">Pax On - Pax Off</td>' ;
//	var tmpldesc6 = '<td class="'+cls+'desc">Current Payload</td>' ;
	var fulltext1 = '<tr>' ;
	var fulltext2 = '<tr>' ;
	var fulltext3 = '<tr>' ;
	var fulltext4 = '<tr>' ;
	var fulltext5 = '<tr>' ;
	var fulltext6 = '<tr>' ;
//	var fulltext7 = '<tr>' ;
	var assignmentlength = -1 ;

	if (typeof (assignment) != 'undefined' && assignment != null)
		assignmentlength = assignment.length ;

	for (var i=0; i<13; i++) {
		if(i==0){
			fulltext1 = tmplhdrdesc;
			fulltext2 = tmpldesc1;
			fulltext3 = tmpldesc2;
			fulltext4 = tmpldesc3;
			fulltext5 = tmpldesc4;
			fulltext6 = tmpldesc5;
//			fulltext7 = tmpldesc6;
		}else if (i>0 && i<=assignmentlength) {
			var dynID = Ext.id();

			if(i==1 || i == assignmentlength){
				fulltext1 = fulltext1 + String.format(tmplhdrnoswitch, assignment[i-1], dynID) ;
			}
			else if (i==2 && assignmentlength>=3) {
				Ext.refDivID[i-1] = dynID;
				fulltext1 = fulltext1 + String.format(tmplhdronlyright, assignment[i-1], dynID, rowindex, Ext.refDivID[i-1], i-1) ;

				if(isrefuelingstat[i-1]) {
					Ext.arrRefStat[i-1] = true;
				} else {
					Ext.arrRefStat[i-1] = false;
				}

				if(isrefuelingcap[i-1]) {
					Ext.arrRefCapStat[i-1] = false;
				} else {
					Ext.arrRefCapStat[i-1] = true;
				}
			}
			else if (i == assignmentlength-1) {
				Ext.refDivID[i-1] = dynID;
				fulltext1 = fulltext1 + String.format(tmplhdronlyleft, assignment[i-1], dynID, rowindex, Ext.refDivID[i-1], i-1) ;

				if(isrefuelingstat[i-1]) {
					Ext.arrRefStat[i-1] = true;
				} else {
					Ext.arrRefStat[i-1] = false;
				}

				if(isrefuelingcap[i-1]) {
					Ext.arrRefCapStat[i-1] = false;
				}else {
					Ext.arrRefCapStat[i-1] = true;
				}
			}
			else {
				Ext.refDivID[i-1] = dynID;
				fulltext1 = fulltext1 + String.format(tmplhdr, assignment[i-1], dynID, rowindex, Ext.refDivID[i-1], i-1) ;

				if(isrefuelingstat[i-1]) {
					Ext.arrRefStat[i-1] = true;
				} else {
					Ext.arrRefStat[i-1] = false;
				}

				if(isrefuelingcap[i-1]){
					Ext.arrRefCapStat[i-1] = false;
				}else {
					Ext.arrRefCapStat[i-1] = true;
				}
			}
			if(typeof(maxpayload)!='undefined' && typeof(tankcapacity)!='undefined'){
				var maxfuelupload = maxpayload[i-1] - ((tankcapacity-fuelarray[i-1]));
				var isfuelvalid = true;
				if ((tankcapacity-fuelarray[i-1]) < 0) {
					isfuelvalid = false;
				}
				fulltext2 = fulltext2 + String.format(tmpl, curtow[i-1], cls+wobval[i-1]) ;
				fulltext3 = fulltext3 + String.format(tmpl, fuelarray[i-1], cls+isfuelvalid) ;
				fulltext4 = fulltext4 + String.format(tmpl, weightonboard[i-1], cls) ;
				fulltext5 = fulltext5 + String.format(tmpl, maxpayload[i-1], cls) ;
				fulltext6 = fulltext6 + String.format(tmpl, paxonoff[i-1], cls+pobval[i-1]) ;
			}
		}
		else {
			fulltext1 = fulltext1 + tmplhdrspc ;
			fulltext2 = fulltext2 + tmplspc ;
			fulltext3 = fulltext3 + tmplspc ;
			fulltext4 = fulltext4 + tmplspc ;
			fulltext5 = fulltext5 + tmplspc ;
			fulltext6 = fulltext6 + tmplspc ;
//			fulltext7 = fulltext7 + tmplspc ;
		}
	}

	fulltext1 = fulltext1 + '</tr>' ;
	fulltext2 = fulltext2 + '</tr>' ;
	fulltext3 = fulltext3 + '</tr>' ;
	fulltext4 = fulltext4 + '</tr>' ;
	fulltext5 = fulltext5 + '</tr>' ;
	fulltext6 = fulltext6 + '</tr>' ;
//	fulltext7 = fulltext7 + '</tr>' ;

	return fulltext1 + fulltext2 + fulltext3 + fulltext4 + fulltext5 + fulltext6;
}

ButtonPanel = Ext.extend(Ext.Panel, {
    layout:'table',
    defaultType: 'button',
    baseCls: 'x-plain',
    cls: 'btn-panel',
    renderTo : 'panel',
    menu: menu,
    split: false,

    layoutConfig: {
        columns:1
    },

    constructor: function(desc, buttons){
        // apply test configs
        for(var i = 0, b; b = buttons[i]; i++){
            b.menu = this.menu;
            b.menu.id = this.menu.id;
            b.enableToggle = this.enableToggle;
            b.split = this.split;
            b.arrowAlign = this.arrowAlign;
        }
        var items = buttons;

        ButtonPanel.superclass.constructor.call(this, {
            items: items
        });
    }
});

// This function renders a block of buttons
function renderButtons(title){
    new ButtonPanel(
        'Text Only',
        [{
            text: ''
        }]
    );
}

var menu = new Ext.menu.Menu({
    style: {
        overflow: 'visible'     // For the Combo popup
    },
    items: [
        {
            text: 'Refueling',
            checked: true,       // when checked has a boolean value, it is assumed to be a CheckItem
            checkHandler: onItemCheck
        }
    ]
});

function onItemCheck(item, checked){
//    Ext.example.msg('Item Check '+ item.acreg + item.port, 'You {1} the "{0}" menu item.', item.text, checked ? 'checked' : 'unchecked');
	EditorBean.setRefueling(item.record.data.ACREG, item.port, checked, function(retval, e) {
		updateFleetAssignment(retval, e, item.record, item.rowindex);
	})
}

function onItemCheckBefore(item, checked){
//	Ext.example.msg('Item Check ', 'You {1} the "{0}" menu item.', item.text, checked ? 'checked' : 'unchecked');
	var currentroute = (item.record.data.assignment.toString().split(','));
	var currentport = item.parentMenu.port;
	var proposedroute = new Array(currentroute.length);
	var found = false;
	var doubleport = false;
	for(var i=0; i<currentroute.length; i++){
		if(found == true){
			proposedroute[i+1] = currentroute[i];
		} else if (found == false){
			proposedroute[i] = currentroute[i];
		}
		if(currentroute[i] == currentport){
			found = true;
			proposedroute[i] = item.text;
			proposedroute[i+1] = currentport;
		}
	}

	for (var j=0; j<proposedroute.length-1; j++){
		if(proposedroute[j] == proposedroute[j+1]){
			doubleport = true;
			break
		}
	}

	if (doubleport == false){
		EditorBean.rearrangeRoute(item.record.data.ACREG, proposedroute, function(retval, e) {
			updateFleetAssignment(retval, e, item.record, item.rowindex);
		})
	}
}

function onItemCheckAfter(item, checked){
//    Ext.example.msg('Item Check ', 'You {1} the "{0}" menu item.', item.text, checked ? 'checked' : 'unchecked');
	var currentroute = (item.record.data.assignment.toString().split(','));
	var currentport = item.parentMenu.port;
	var proposedroute = new Array(currentroute.length);
	var found = false;
	var doubleport = false;
	for(var i=0; i<currentroute.length; i++){
		if(found == true){
			proposedroute[i+1] = currentroute[i];
		} else if (found == false){
			proposedroute[i] = currentroute[i];
		}
		if(currentroute[i] == currentport){
			found = true;
			proposedroute[i] = currentport;
			proposedroute[i+1] = item.text;
		}
	}

	for (var j=0; j<proposedroute.length-1; j++){
		if(proposedroute[j] == proposedroute[j+1]){
			doubleport = true;
			break
		}
	}

	if (doubleport == false){
		EditorBean.rearrangeRoute(item.record.data.ACREG, proposedroute, function(retval, e) {
			updateFleetAssignment(retval, e, item.record, item.rowindex);
		})
	}
}

function onItemClick(item){
	if(item.onoff == "0/0"){
		var currentroute = (item.record.data.assignment.toString().split(','));
		var currentport = item.port;
		var proposedroute = new Array(currentroute.length-1);
		var found = false;
		var doubleport = false;
		for(var i=0; i<currentroute.length; i++){
			if(found == true){
				proposedroute[i-1] = currentroute[i];
			} else if (found == false){
				proposedroute[i] = currentroute[i];
			}
			if(currentroute[i] == currentport){
				found = true;
	//			proposedroute[i] = currentport;
	//			proposedroute[i+1] = item.text;
			}
		}

		for (var j=0; j<proposedroute.length; j++){
			if(proposedroute[j] == proposedroute[j+1]){
				doubleport = true;
				break
			}
		}

		if (doubleport == false){
			EditorBean.rearrangeRoute(item.record.data.ACREG, proposedroute, function(retval, e) {
				updateFleetAssignment(retval, e, item.record, item.rowindex);
			})
		}

	    Ext.example.msg('Unassigned Port', ' "{0}" has been unassigned', item.port);
	} else {
		Ext.example.msg('Unassigned Port', 'Passenger in "{0}" is not empty', item.port);
	}
}

function createRefuelingMenu(record, rowindex) {
	for(var i = 0; i < Ext.refDivID.length; i++){
		if(typeof (Ext.refDivID[i]) != 'undefined'){
			var menurefuelingbefore = new Array(record.data.refuelingports.length);
			var menurefuelingafter = new Array(record.data.refuelingports.length);
			for(var x = 0; x < record.data.refuelingports.length; x++){
				var refuelingitem =  new Ext.menu.CheckItem({
					text: record.data.refuelingports[x],
		            checked: false,
		            checkHandler: onItemCheckBefore,
		            rowindex: rowindex,
		            group: 'bef',
		            record: record
				});
				menurefuelingbefore[x] = refuelingitem;
			}

			for(var x = 0; x < record.data.refuelingports.length; x++){
				var refuelingitem =  new Ext.menu.CheckItem({
					text: record.data.refuelingports[x],
		            checked: false,
		            checkHandler: onItemCheckAfter,
		            rowindex: rowindex,
		            group: 'nxt',
		            record: record
				});
				menurefuelingafter[x] = refuelingitem;
			}

			ButtonPanel.override({
		        enableToggle: true,
		        menu: new Ext.menu.Menu({
		        		id: Ext.id(),
					    style: {
					        overflow: 'visible'
					    },
					    items: [
					        {
					            text: 'Refueling?',
					            checked: Ext.arrRefStat[i],
					            record: record,
					            rowindex: rowindex,
					            disabled: Ext.arrRefCapStat[i],
								port: record.data.assignment[i],
					            checkHandler: onItemCheck
					        }, '-',
					        {
					            text: 'Add Refueling Station Before',
					            enableToggle: true,
					            menu: {
					                items: menurefuelingbefore,
					                port: record.data.assignment[i],
					            	rowindex: rowindex,
					                style: {
								        overflow: 'visible'
								    }
					            }
					        }, '-',
					        {
					            text: 'Add Refueling Station After',
					            enableToggle: true,
					            menu: {
					                items: menurefuelingafter,
					                port: record.data.assignment[i],
					            	rowindex: rowindex,
					                style: {
								        overflow: 'visible'
								    }
					            }
					        }, '-',
					        {
					            text: 'Unassign Port',
					            enableToggle: true,
					            handler: onItemClick,
				                port: record.data.assignment[i],
				                onoff: record.data.paxonoff[i],
		            			record: record
					        }
					    ]
					}),
		        renderTo: Ext.refDivID[i],
		        height:5,
		        style: {
		            marginBottom: '3px',
		            opacity: 0.5
		        }
		    });
		    renderButtons('Normal Buttons');
		}
    }
	Ext.refDivID = [];
}

function updateFleetAssignment(retval, e, record, rowindex) {
	if (typeof (retval) != 'undefined') {
		var result = retval['result'] ;
		var arrScen = ['', retval['scenarioid'], ''];

		var err = retval['err'] ;
		if (err)
			Ext.example.msg('Assignment', 'Assignment return error : {0}', err) ;
		else {
			if(typeof (record) != 'undefined'){
				var ischanged = retval['ischanged'] ;

				record.data.paxon = retval['paxon'] ;
				record.data.paxoff = retval['paxoff'] ;
				record.data.isrefuelingcap = retval['isrefuelingcap'];
				record.data.refuelingports = retval['refuelingports'];
				record.data.refuelingstatus = retval['refuelingstatus'];
				record.data.curtow = retval['tow'];
				record.data.maxfuelupload = retval['maxfuel'];
				record.data.paxonoff = retval['paxonoff'];
				record.data.maxpayload = retval['maxpayload'];
				record.data.curpayload = retval['payload'];
				record.data.weightonboard = retval['weightonboard'];
				record.data.tankcapacity = retval['tankcapacity'];

				record.data.pobval = retval["pobvalidity"];
				record.data.wobval = retval["wobvalidity"];
				record.data.fuelval = retval["fuelvalidity"];

				if (ischanged) {
					record.data.assignment = retval["portname"] ;
					record.data.fuelarray = retval["fuelonboard"] ;
					record.data.fuelneed = retval["fuelneed"] ;

					startport = 'SPG' ;
		            draw_assignment(startport, record.data) ;
				}

				//	            record.data.targetEl = targetEl ;
	            var loadtext = generateLoadTable(rowindex, record.data.fuelval, record.data.assignment, record.data.fuelarray,
	            	record.data.fuelneed, record.data.paxon,
	            	record.data.paxoff, record.data.PATHCOLOR,
	            	record.data.pobval, record.data.wobval,
	            	record.data.isrefuelingcap,
	            	record.data.refuelingstatus,
	            	record.data.curtow, record.data.maxfuelupload,
	            	record.data.paxonoff, record.data.maxpayload,
	            	record.data.curpayload, record.data.weightonboard, record.data.tankcapacity) ;

	            record.data.PRESENTATION = loadtext ;

	            record.commit () ;

				createRefuelingMenu(record, rowindex);

				Ext.patientView.store.reload();
				Ext.dsAssignedReservation.reload();
				Ext.scenarioId = retval['scenarioid'] ;
				Ext.cmbScenario.setValue (retval['scenarioid']) ;
			}
		}
	}
}

/*
 * Here is where we "activate" the GridPanel.
 * We have decided that the element with class "hospital-target" is the element which can receieve
 * drop gestures. So we inject a method "getTargetFromEvent" into the DropZone. This is constantly called
 * while the mouse is moving over the DropZone, and it returns the target DOM element if it detects that
 * the mouse if over an element which can receieve drop gestures.
 *
 * Once the DropZone has been informed by getTargetFromEvent that it is over a target, it will then
 * call several "onNodeXXXX" methods at various points. These include:
 *
 * onNodeEnter
 * onNodeOut
 * onNodeOver
 * onNodeDrop
 *
 * We provide implementations of each of these to provide behaviour for these events.
 */
function initializeHospitalDropZone(g) {
    g.dropZone = new Ext.dd.DropZone(g.getView().scroller, {

//      If the mouse is over a target node, return that node. This is
//      provided as the "target" parameter in all "onNodeXXXX" node event handling functions
        getTargetFromEvent: function(e) {
            return e.getTarget('.hospital-target');
        },

//      On entry into a target node, highlight that node.
        onNodeEnter : function(target, dd, e, data){
            Ext.fly(target).addClass('hospital-target-hover');
        },

//      On exit from a target node, unhighlight that node.
        onNodeOut : function(target, dd, e, data){
            Ext.fly(target).removeClass('hospital-target-hover');
        },

//      While over a target node, return the default drop allowed class which
//      places a "tick" icon into the drag proxy.
        onNodeOver : function(target, dd, e, data){
            var rowIndex = g.getView().findRowIndex(target);
            var h = g.getStore().getAt(rowIndex);
            var acregstatusover = h.data.STATUS;

            //if (h.data.revassignment[data.patientData.name] >= 0)
            //	return false ;
			if(acregstatusover == 'ACTIVE')
            return Ext.dd.DropZone.prototype.dropAllowed;
        },

//      On node drop, we can interrogate the target node to find the underlying
//      application object that is the real target of the dragged data.
//      In this case, it is a Record in the GridPanel's Store.
//      We can use the data set up by the DragZone's getDragData method to read
//      any data we decided to attach.
        onNodeDrop : function(target, dd, e, data){
            var rowIndex = g.getView().findRowIndex(target);
            var h = g.getStore().getAt(rowIndex);
            var acregstatus = h.data.STATUS;
            var targetEl = Ext.get(target);

			var sel = data.selections ;
            var org = data.patientData.ORG ;
            var dest = data.patientData.DEST ;
            var resvids = [] ;
            for(i=0;i<sel.length;i++){
            	resvids[i] = sel[i].data.RESERVATIONID ;
            }

			if(acregstatus == 'ACTIVE'){
				assignroute() ;
			}

        	function assignroute () {
				var acreg = h.data.ACREG ;

				presentationMask.show();
				EditorBean.assignMultiFleetAtEnd(acreg,resvids,function(retval, e) {
					presentationMask.hide();
					updateFleetAssignment(retval, e, h, rowIndex);
				}) ;
				return ;
			}

			// remove a port from a route
			// port = data.patientData.name
            function removeroute () {
			    var NOT_ASSIGNED ;
				var overlay ;
				var port1 ;
				var port2 ;
            	var hqidx = h1.data.revassignment[data.patientData.DEST] ;
            	var oldassignment = h1.data.assignment ;

				overlay = NOT_ASSIGNED ;
				if (typeof(oldassignment[hqidx].overlay) != "undefined") {
					port1 = oldassignment[hqidx].overlay.port1 ;
					if (hqidx<oldassignment.length-1) {
						isbidirectional = false ;
						if (oldassignment.length == 2)
							isbidirectional = true ;

						port2 = oldassignment[hqidx+1].overlay.port2 ;
						overlay = draw_curve(port1, port2, h1.data.pathcolor, isbidirectional) ;
						oldassignment[hqidx+1].overlay.remove () ;
						oldassignment[hqidx+1].overlay = overlay ;

						if (hqidx>0) {
							port1 = oldassignment[hqidx].overlay.port1 ;
							port2 = oldassignment[hqidx].overlay.port2 ;
							overlay = draw_curve(port1, port2, h1.data.pathcolor, isbidirectional) ;
							oldassignment[hqidx].overlay.remove () ;
							oldassignment[hqidx].overlay = overlay ;
						}
					}

					// if this port is the last port, update the returnpath
					if (hqidx==oldassignment.length-1) {
						if (typeof (oldassignment[0].returnpath) != "undefined") {
							oldassignment[0].returnpath.remove() ;
							oldassignment[0].returnpath = NOT_ASSIGNED ;
						}

						// only draw return path if number of port after removal is greater than 1
						if (oldassignment.length>2) {
							port1 = oldassignment[0].overlay.port1 ;
							port2 = oldassignment[hqidx].overlay.port1 ;
							oldassignment[0].returnpath = draw_curve(port2, port1, h1.data.pathcolor, false) ;
						}
					}

					oldassignment[hqidx].overlay.remove() ;
					oldassignment[hqidx].overlay = NOT_ASSIGNED ;
				}

            	h1.data.revassignment = null ;
            	h1.data.assignment = null ;

            	oldassignment.splice (hqidx, 1) ;
            	// rebuild revassignment
            	var revassignment = [] ;
            	var newassignment = [] ;
	            var startport = "SPG" ;

            	for (var i=0; i<oldassignment.length; i++) {
            		revassignment[oldassignment[i].data.DEST] = i ;
            		newassignment[i] = oldassignment[i] ;

	            	if (i<h.data.assignment.length-1)
	            		startport = oldassignment[i].data.DEST ;
            	}

            	oldassignment = null ;

            	h1.data.assignment = newassignment ;
            	h1.data.revassignment = revassignment ;

            	h1.commit () ;
            }
            return true;
        }
    });
}

function reloadRoute(acreg){
	if(typeof(Ext.fleetGrid)=='undefined'){
		reloadRoute.defer(1000);
		return ;
	}

	var NOT_DEFINED ;
	var v = Ext.fleetGrid.getView() ;
	if(Ext.scenarioId != null) {
		for (var i=0; i<Ext.dsAcreg.data.items.length; i++) {
			var el = v.getRow(i) ;
			var rowIndex = v.findRowIndex(el);
	        var h = Ext.dsAcreg.getAt(rowIndex);

			if ((acreg==null) || (typeof(acreg)=='undefined') || (acreg == h.data.ACREG)) {
				if (typeof(h.data.legs)!='undefined') {
					for (j=0; j<h.data.legs.length; j++) {
						h.data.legs[j].overlay.remove () ;
						h.data.legs[j].org = '---' ;
						h.data.legs[j].dest = '---' ;
					}
				}

				EditorBean.loadRoute(h.data.ACREG,rowIndex,function(retval, e) {
					var idx = retval["rowindex"] ;
					var h1 = Ext.dsAcreg.getAt(idx);
					retval['ischanged'] = true ;
					updateFleetAssignment(retval, e, h1, idx);
				}) ;
			}
		}

		if(!Ext.isReloadScenario && !Ext.isUnassign){
			Ext.dsReservation.baseParams['flightsession'] = '2343';
			Ext.dsReservation.reload();

			Ext.dsReservation.baseParams['flightsession'] = Ext.cmbFlSession.value;
			Ext.dsReservation.reload();
		}

		Ext.isReloadScenario = false;
		Ext.dsAssignedReservation.reload();
	} else {
		Ext.dsReservation.baseParams['flightsession'] = '2343';
		Ext.dsReservation.reload();

		Ext.dsReservation.baseParams['flightsession'] = Ext.cmbFlSession.value;
		Ext.dsReservation.reload();
	}
}

	var presentationMask = new Ext.LoadMask('presentation', {msg:'Assign Reservation and Draw Route...'});
	var mapMask = new Ext.LoadMask('map_canvas',  {msg:''});
	var menuMask = new Ext.LoadMask('menubar',  {msg:''});
	
	
    function showLoadFn(statusBar) {
    	presentationMask.show();
    	mapMask.show();
    	menuMask.show();
		Ext.pBar.wait({
			interval: 100,
			duration: Ext.dsScenConf.data.items[0].data.TOTALCALCTIME + 20000 ,
			increment: 20,
			fn: function() {
				presentationMask.hide();
		    	mapMask.hide();
		    	menuMask.hide();
			}
		});
	};
	
	function hideLoadFn(statusBar) {
		presentationMask.hide();
    	mapMask.hide();
    	menuMask.hide();
		Ext.pBar.wait({
			interval: 100,
			duration: Ext.dsScenConf.data.items[0].data.TOTALCALCTIME + 20000 ,
			increment: 20,
			fn: function() {
				presentationMask.hide();
		    	mapMask.hide();
		    	menuMask.hide();
			}
		});
	};

	function addStuff(){
	  var div = document.getElementById('scenlogdiventry');
	  var test = div.scrollHeight;
	  div.scrollTop = test;
	};

Ext.refreshData = function (acreg) {
	reloadRoute (acreg) ;
};


Ext.onReady(function(){
	Ext.talian.REMOTING_API.enableBuffer = 0;
   	var remotingProvider = Ext.Direct.addProvider( Ext.talian.REMOTING_API);

   	Djn.RemoteCallSupport.addCallValidation(remotingProvider);
    Djn.RemoteCallSupport.validateCalls = true;


    var mapcanvas = document.getElementById("map_canvas");

    Ext.portarray = new Array();

    var map = new GMap2(mapcanvas);
    
    /**
     * OPTION FOR ARCGIS
     * 
     * ArcGISSpatialReferences.addSpatialReference('2250','PROJCS[\"P2-EXC_UTM50S\",GEOGCS[\"P2-EXC\",DATUM[\"P2-EXC T9\",SPHEROID[\"Bessel_1841\",6377397.155,299.1528128]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Transverse_Mercator\"],PARAMETER[\"False_Easting\",500000.0],PARAMETER[\"False_Northing\",10000000.0],PARAMETER[\"Central_Meridian\",117.0],PARAMETER[\"Scale_Factor\",0.9996],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]');
			
			
      var tileInfo = {
	    "rows" : 512, 
	    "cols" : 512, 
	    "dpi" : 96, 
	    "format" : "PNG8", 
	    "compressionQuality" : 0, 
	    "origin" : {
	      "x" : -5120200, 
	      "y" : 19997000
	    }, 
	    "spatialReference" : {
	      "wkid" : 2550
	    }, 
	    "lods" : [
	      {"level" : 0, "resolution" : 169.333672000677, "scale" : 640000}, 
	      {"level" : 1, "resolution" : 84.6668360003387, "scale" : 320000}, 
	      {"level" : 2, "resolution" : 42.3334180001693, "scale" : 160000}, 
	      {"level" : 3, "resolution" : 21.1667090000847, "scale" : 80000}, 
	      {"level" : 4, "resolution" : 10.5833545000423, "scale" : 40000}, 
	      {"level" : 5, "resolution" : 5.29167725002117, "scale" : 20000}, 
	      {"level" : 6, "resolution" : 2.64583862501058, "scale" : 10000}, 
	      {"level" : 7, "resolution" : 1.32291931250529, "scale" : 5000}, 
	      {"level" : 8, "resolution" : 0.661459656252646, "scale" : 2500}, 
	      {"level" : 9, "resolution" : 0.264583862501058, "scale" : 1000}, 
	      {"level" : 10, "resolution" : 0.132291931250529, "scale" : 500}
	    ]
	  };
	  
      var url = 'http://idepbpn-apgis01/ArcGIS/rest/services/Cache/GisGeneral/MapServer';
      var agsType = new ArcGISMapType(url,{projection: new ArcGISProjection(tileInfo)});
      // note no load event listener.
      var map = new GMap2(document.getElementById("map"), { mapTypes: [agsType]});
      map.setCenter(new GLatLng(-0.780005,117.490082), 15);
     * 
     */
    
    //map.addControl(new GSmallMapControl());
    map.addControl(new GMapTypeControl());
    map.setCenter(new GLatLng(-0.833889,117.340647), 9);
    map.enableScrollWheelZoom();
    Ext.gmap = map ;

    // Create a base icon for all of our markers that specifies the
    // shadow, icon dimensions, etc.
    var baseIcon = new GIcon(G_DEFAULT_ICON);
    baseIcon.iconSize = new GSize(20, 20);
    baseIcon.shadowSize = new GSize(20, 2);
    baseIcon.iconAnchor = new GPoint(9, 9);
    baseIcon.infoWindowAnchor = new GPoint(9, 2);

    // Creates a marker whose info window displays the letter corresponding
    // to the given index.
    function createMarker(point, index, label, degree) {
      // Create a lettered icon for this point using our icon class
      var myIcon = new GIcon(baseIcon);
      //myIcon.image = "/coco001/webclient/images/helipad_circle.png";

      if((degree >=	 0 && degree < 45) || (degree >= 180 && degree < 225)){
    	  myIcon.image = "/coco001.war/webclient/images/helipad_circle.png";
      } else if ((degree >= 45 && degree < 90) || (degree >= 225 && degree < 270)){
    	  myIcon.image = "/coco001.war/webclient/images/helipad_circle_45.png";
      } else if ((degree >= 90 && degree < 135) || (degree >= 270 && degree < 315)) {
    	  myIcon.image = "/coco001.war/webclient/images/helipad_circle_90.png";
      } else if ((degree >= 135 && degree < 180) || (degree >= 315 && degree < 360)) {
    	  myIcon.image = "/coco001.war/webclient/images/helipad_circle_135.png";
      }

      // Set up our GMarkerOptions object
      markerOptions = { icon:myIcon, title:label };
      var marker = new GMarker(point, markerOptions);
      marker.title = label ;

      GEvent.addListener(marker, "click", function() {
        marker.openInfoWindowHtml("Heliport <b>" + marker.title + "</b>");
      });
      return marker;
    }

    for(var i=0; i<Ext.dsHeliport.data.length; i++){
    	Ext.allports[i] = {
    		lat: Ext.dsHeliport.data.items[i].data['LATDEGREE'],
    		lng: Ext.dsHeliport.data.items[i].data['LOTDEGREE'],
    		label: Ext.dsHeliport.data.items[i].data['HELIPORT'],
    		deg: Ext.dsHeliport.data.items[i].data['HEADINGANGLE']
		}
	}

    // Add 10 markers to the map at random locations
    for (var i = 0; i < Ext.allports.length; i++) {
       var point = new GLatLng(Ext.allports[i].lat, Ext.allports[i].lng) ;
       map.addOverlay(createMarker(point, i, Ext.allports[i].label, Ext.allports[i].deg));

       Ext.portarray[Ext.allports[i].label] = Ext.allports[i] ;
    }

//    for (var i = 0; i < ports.length; i++) {
//       var point = new GLatLng(ports[i].lat, ports[i].lng) ;
//       map.addOverlay(createMarker(point, i, ports[i].label));
//
//       Ext.portarray[ports[i].label] = ports[i] ;
//    }

    Ext.winScenario = new Ext.Window({
    	title: 'List of Scenario per Flight Session',
//        applyTo:'scenarios',
        layout:'fit',
        position:'absolute',
		width:500,
        height:300,
		top:400,
        closeAction:'hide',
        plain: true,

        items: Ext.scenarioViewer
    });

    Ext.winDetailResv = new Ext.Window({
    	title: 'Detail Reservations',
//        applyTo:'scenarios',
        layout:'fit',
        position:'absolute',
		width:500,
        height:300,
		top:400,
        closeAction:'hide',
        plain: true,

        items: Ext.detailResvViewer
    });

    Ext.loadFn = function(btn, statusBar){
	    btn = Ext.getCmp(btn);
	    statusBar = Ext.getCmp(statusBar);
	    btn.disable();
	    statusBar.showBusy();
	    if(Ext.scenConfViewer.getForm().isValid()){
			EditorBean.saveScenConfig(
				Ext.scenConfViewer.getForm().el.dom[0].value,
				Ext.scenConfViewer.getForm().el.dom[1].value.toString(),
				Ext.scenConfViewer.getForm().el.dom[2].value.toString(),
				Ext.scenConfViewer.getForm().el.dom[3].value,
				Ext.scenConfViewer.getForm().el.dom[4].value,
				function(){
			        statusBar.clearStatus({useDefaults:true});
			        btn.enable();
			    }
			);
		};
	};

	Ext.winTambahComment = new Ext.Window({
	    title: 'Add Remarks to Report',
	    layout:'fit',
	    position:'absolute',
	    width:350,
	    height:200,
	    top:400,
	    closeAction:'hide',
	    plain: true,
	    items: Ext.tambahReportViewer,
	    buttons: [{
	        id: 'tambahSaveButton',
	        text:'Save',
	        handler: Ext.loadAddCommentFn.createCallback('tambahSaveButton', 'tambahStatusBar')
	    },{
	        text: 'Close',
	        handler: function(){
	            try {
	                Ext.winTambahComment.hide();
	            }
	            catch (e) {
	            }
	        }
	    }],
	    bbar: new Ext.ux.StatusBar({
	        id: 'tambahStatusBar',
	        defaultText: 'Success',
	        text: 'Ready',
	        iconCls: 'x-status-valid'
	    })
	});
	
    Ext.winScenConf = new Ext.Window({
    	title: 'Basic Configurations',
        layout:'fit',
        position:'absolute',
		width:500,
        height:300,
		top:400,
        closeAction:'hide',
        plain: true,
        items: Ext.scenConfViewer,
        buttons: [{
        	id: 'confSaveButton',
            text:'Save',
			handler: Ext.loadFn.createCallback('confSaveButton', 'configStatusBar')
        },{
            text: 'Close',
            handler: function(){
        		try {
        			Ext.countWhere++;
					Ext.dsScenConf.baseParams['where'] = "scenconfigid = 0 and scenarioid is null and "+ Ext.countWhere+"="+Ext.countWhere;
					Ext.dsScenConf.load();
        			Ext.winScenConf.hide();
        		}
        		catch (e) {
        		}
            }
        }],
        bbar: new Ext.ux.StatusBar({
            id: 'configStatusBar',
            defaultText: 'Success',
            text: 'Ready',
            iconCls: 'x-status-valid'
        })
    });

    Ext.winAcregConf = new Ext.Window({
    	title: 'ACREG Configurations',
        layout:'fit',
        position:'absolute',
		width:500,
        height:300,
		top:400,
        closeAction:'hide',
        plain: true,

        items: Ext.fpTest
    });
    
    Ext.winSwitchFlight = new Ext.Window({
    	title: 'Switch Flight',
        layout:'fit',
        position:'absolute',
		width:300,
        height:170,
		top:400,
        closeAction:'hide',
        plain: true,

        items: Ext.fpSwitchFlight
    });

    Ext.pBar = new Ext.ProgressBar({
		id: 'pBar',
		width: 480
	});

    Ext.winLogs = new Ext.Window({
        applyTo:'scenlogs',
        layout:'fit',
        position:'absolute',
		width:500,
        height:300,
		top:400,
        closeAction:'hide',
        plain: true,

        items: new Ext.TabPanel({
            applyTo: 'scenlogdiv',
            autoTabs:true,
            activeTab:0,
            deferredRender:false,
			autoScroll: true,
            border:false
        }),

        buttons: [{
			text: 'Stop',
			handler: function(){
					EditorBean.stopAssignment();
					Ext.out.append ('Automatic Schedulling has been Terminated');
					Ext.out.append ('Saving...');
					Ext.pollProvider.disconnect() ;
//					Ext.pBar.reset();
//					Ext.out.append ('Automatic Schedulling stopped successfully...');
				}
			},
			{
            text: 'Close',
            handler: function(){
        		try {
        			Ext.countWhere++;
        			Ext.dsScenario.removeAll();
        			Ext.dsScenario.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
        			"and flightsession='"+Ext.flightSessionId+"' and "+Ext.countWhere+"="+Ext.countWhere;
        			Ext.dsScenario.load();
        			Ext.winLogs.hide();
        		}
        		catch (e) {
//        			console.log ("Error : " + e) ;
        		}
            }
        }],
        bbar: {
			id: 'sBar',
			items: [Ext.pBar]
		}
    });

	Ext.out = new Ext.form.DisplayField({
		        cls: 'x-form-text',
		        renderTo: 'scenlogdiventry',
		        id: 'out',
		        layout: 'fit'
		    });

	Ext.Direct.on('log', function(e){
				Ext.out.reset ();
	        	Ext.out.append(e.data);
	            Ext.out.el.scroll('b', 100000, true);
				addStuff();
	            if (e.data.indexOf('DONE') != -1 ){
	                Ext.pollProvider.disconnect () ;
	                Ext.MessageBox.show({
	                    title:'Resume Calculation?',
	                    msg: 'Calculation has finished. <br />Would you like to resume the calculation?',
	                    buttons: Ext.MessageBox.YESNO,
	                    fn: resumeCalculation,
	                    icon: Ext.MessageBox.QUESTION
	                });
	            }
	    	});
	
	function resumeCalculation(btn){
        if (btn == 'yes') {
        	Ext.pollProvider.connect ();
        	Ext.loadFn1();
        	Ext.calcTimer();
        	EditorBean.autoAssignment ("TRUE", function(retval, e) {
				var result = retval['result'];
				Ext.example.msg(result);
			}) ;
		} else {
			Ext.stopFn2();
			
			 Ext.MessageBox.show({
		           msg: 'Saving your data, please wait...',
		           progressText: 'Saving...',
		           width:300,
		           wait:true,
		           waitConfig: {interval:200},
		           icon:'ext-mb-download', //custom class in msg-box.html
		           animEl: 'mb7'
		       });
			 
	        EditorBean.autoAssignment ("FALSE", function(retval, e) {
    			Ext.MessageBox.hide();
				var result = retval['result'];
				Ext.example.msg(result);
				
				Ext.countWhere++;
    			Ext.dsScenario.removeAll();
    			Ext.dsScenario.baseParams['where'] = "reservedate={ d '"+ Ext.cDate.format(('Y-n-j')) +"' } " +
    			"and flightsession='"+Ext.flightSessionId+"' and "+Ext.countWhere+"="+Ext.countWhere;
    			Ext.dsScenario.load();
			}) ;
		}
    };

	Ext.Direct.addProvider(
		        Ext.talian.REMOTING_API,
		        {
		            id: 'pollProvider',
		            type:'polling',
		            url: Ext.talian.POLLING_URLS.log,
		            interval: 1000
		        }
		    );

	Ext.pollProvider = Ext.Direct.getProvider('pollProvider') ;
	Ext.pollProvider.disconnect() ;

    drageanddropzone() ;
//	Ext.scenarioViewer.render('scenariovw');
    reloadRoute.defer(1000);
    
    setTimeout(function(){
	    Ext.get('loading').remove();
	    Ext.get('loading-mask').fadeOut({remove:true});
	  }, 250);
 });

 function BDCCArrowedPolyline(points, color, weight, opacity, opts, gapPx, headLength, headColor, headWeight, headOpacity, isbidirection) {

    this.gapPx = gapPx;
    this.points = points;
    this.color = color;
    this.weight = weight;
    this.opacity = opacity;
    this.headLength = headLength;
    this.headColor = headColor;
    this.headWeight = headWeight;
    this.headOpacity = headOpacity;
    this.opts = opts;
    this.heads = new Array();
    this.line = null;
	this.isbidirection = isbidirection ;

}
BDCCArrowedPolyline.prototype = new GOverlay();


BDCCArrowedPolyline.prototype.initialize = function(map) {

    this.map = map;
    this.prj = map.getCurrentMapType().getProjection();
    var rdrw = GEvent.callback(this, this.recalc);
  	this.lstnMoveEnd = GEvent.addListener(map,"zoomend", function(){ rdrw (); });
  	this.lstnType = GEvent.addListener(map,"maptypechanged",function(){rdrw ();});

  	this.recalc();//first draw
}

BDCCArrowedPolyline.prototype.remove = function() {
    try{
        if (this.line)
            this.map.removeOverlay(this.line);
        for(var i=0; i<this.heads.length; i++)
            this.map.removeOverlay(this.heads[i]);
    }
    catch(ex)
    {
    }
}

BDCCArrowedPolyline.prototype.redraw = function(force) {
	pausecomp(500);
    return;//do nothing, the GPolyline line and heads draw themselves
}


BDCCArrowedPolyline.prototype.copy = function(map) {
    return new BDCCArrowedPolyline(this.points,this.color,this.weight,this.opacity,this.opts,this.gapPx, this.headLength, this.headColor, this.headWeight, this.headOpacity, this.isbidirection);
}

function pausecomp(ms) {
	ms += new Date().getTime();
	while (new Date() < ms){}
	} 

BDCCArrowedPolyline.prototype.recalc = function() {
   var zoom = this.map.getZoom();

   this.remove();
   
   //the main polyline
   this.line = new GPolyline(this.points,this.color,this.weight,this.opacity,this.opts);
   this.map.addOverlay(this.line);

   // the arrow heads
   this.heads = new Array();

   var p1 = this.prj.fromLatLngToPixel(this.points[0],  zoom);//first point
   var p2;//next point
   var dx;
   var dy;
   var sl;//segment length
   var theta;//segment angle
   var ta;//distance along segment for placing arrows

   for (var i=1; i<this.points.length; i++){

      p2 = this.prj.fromLatLngToPixel(this.points[i],  zoom)
      dx = p2.x-p1.x;
      dy = p2.y-p1.y;

	if (Math.abs(this.points[i-1].lng() - this.points[i].lng()) > 180.0)
		dx = -dx;

      sl = Math.sqrt((dx*dx)+(dy*dy));
      theta = Math.atan2(-dy,dx);



      j=1;

	if(this.gapPx == 0){
		//just put one arrow at the end of the line
        	this.addHead(p2.x,p2.y,theta,zoom);
	}
	else if(this.gapPx == 1) {
		//just put one arrow in the middle of the line
        	var x = p1.x + ((sl/2) * Math.cos(theta));
        	var y = p1.y - ((sl/2) * Math.sin(theta));
        	this.addHead(x,y,theta,zoom);
	}
	else{
      	//iterate along the line segment placing arrow markers
      	//don't put an arrow within gapPx of the beginning or end of the segment

	      ta = this.gapPx;
      	while(ta < sl){
        	var x = p1.x + (ta * Math.cos(theta));
        	var y = p1.y - (ta * Math.sin(theta));
			if (this.isbidirection) {
				if (ta <= sl/2)
					this.addHead(x,y,theta,zoom);
				else
					this.addHead(x,y,Math.PI + theta,zoom);
			}
			else
				this.addHead(x,y,theta,zoom);
        	ta += this.gapPx;
      	}

        	//line too short, put one arrow in its middle
      	if(ta == this.gapPx){
        		var x = p1.x + ((sl/2) * Math.cos(theta));
        		var y = p1.y - ((sl/2) * Math.sin(theta));
        		this.addHead(x,y,theta,zoom);
      	}
	}

      p1 = p2;
   }
}

BDCCArrowedPolyline.prototype.addHead = function(x,y,theta,zoom) {

    //add an arrow head at the specified point
    var t = theta + (Math.PI/4) ;
    if(t > Math.PI)
        t -= 2*Math.PI;
    var t2 = theta - (Math.PI/4) ;
    if(t2 <= (-Math.PI))
        t2 += 2*Math.PI;
    var pts = new Array();
    var x1 = x-Math.cos(t)*this.headLength;
    var y1 = y+Math.sin(t)*this.headLength;
    var x2 = x-Math.cos(t2)*this.headLength;
    var y2 = y+Math.sin(t2)*this.headLength;
    pts.push(this.prj.fromPixelToLatLng(new GPoint(x1,y1), zoom));
    pts.push(this.prj.fromPixelToLatLng(new GPoint(x,y), zoom));
    pts.push(this.prj.fromPixelToLatLng(new GPoint(x2,y2), zoom));
    this.heads.push(new GPolyline(pts,this.headColor,this.headWeight,this.headOpacity,this.opts));
    this.map.addOverlay(this.heads[this.heads.length-1]);
}
