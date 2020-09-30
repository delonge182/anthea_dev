/*!
 * Ext JS Library 3.2.1
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */


// setup drag and drop zone
function drageanddropzone () {
	
	Ext.talian.REMOTING_API.enableBuffer = 0;
   	var remotingProvider = Ext.Direct.addProvider( Ext.talian.REMOTING_API);
   	var isReservationLoaded = false ;
   	var isSummaryLoaded = false ;

    var reservations = [{
        reservationID: '11111',
        name: 'AAA',
        address: 'Main Street',
        telephone: '555 1234 123',
        paxoff: 1,
        paxon:  2,
        loadoff: 80,
        loadon:  160,
		weight: 80,
		from: 'SPG',
		to: 'CPU',
        clname: 'patient-label'
    }, {
        reservationID: '22222',
        name: 'BBB',
        paxoff: 3,
        paxon:  4,
        loadoff: 240,
        loadon:  320,
		weight: 80,
		from: 'SPG',
		to: 'CPU',
        clname: 'patient-label'
    }, {
        reservationID: '33333',
        name: 'CCC',
        paxoff: 12,
        paxon:  12,
        loadoff: 960,
        loadon:  960,
		weight: 80,
		from: 'SPG',
		to: 'CPU',
        clname: 'patient-label'
    },
    {
        reservationID: '33555',
        name: 'DDD',
        paxoff: 5,
        paxon:  1,
        loadoff: 80,
        loadon:  400,
		weight: 80,
		from: 'SPG',
		to: 'CPU',
        clname: 'patient-label'
    },{
        reservationID: '44444',
        name: 'EEE',
        paxoff: 1,
        paxon:  2,
        loadoff: 80,
        loadon:  160,
		weight: 80,
		from: 'SPG',
		to: 'CPU',
        clname: 'patient-label'
    }, {
        reservationID: '55555',
        name: 'FFF',
        paxoff: 0,
        paxon:  1,
        loadoff: 0,
        loadon:  80,
		weight: 80,
		from: 'SPG',
		to: 'CPU',
        clname: 'patient-label'
    }, {
        reservationID: '66666',
        name: 'GGG',
        paxoff: 1,
        paxon:  1,
        loadoff: 80,
        loadon:  80,
		weight: 80,
		from: 'SPG',
		to: 'ACT',
        clname: 'patient-label'
    }, {
        reservationID: '77777',
        name: 'HHH',
        paxoff: 1,
        paxon:  0,
        loadoff: 80,
        loadon:  0,
		weight: 80,
		from: 'SPG',
		to: 'CPU',
        clname: 'patient-label'
    }, {
        reservationID: '88888',
        name: 'III',
        paxoff: 1,
        paxon:  0,
        loadoff: 80,
        loadon:  0,
		weight: 80,
		from: 'SPG',
		to: 'CPU',
        clname: 'patient-label'
    }];
    
    var pager = new Ext.PagingToolbar({
        store: dsReservation,
        displayInfo: true,
        pageSize: 20
      });
    
   	var dsReservation = new Ext.data.DirectStore( {
	    paramsAsHash:false,
	    root:'data',
	    directFn: DataBean.getMbo,
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
	      {name: 'LUGGAGEWEIGHT'},
	      {name: 'PAXWEIGHT'}
	    ],
	    listeners: {
	      load: function(s, records){
	        textStatus ("Loaded " + records.length + " records", true, false) ;
	      }
	    },
	    baseParams : {
	        start : 0,
	        limit : 40,
	        sort : "RESERVATIONID",
	        mboname : "RESERVATION",
	        where : "FLIGHTSESSION='0730'",
	        dir : "ASC"
	    },
	    paramOrder: 'mboname|where|start|limit|sort|dir'  		    
    });


    var PatientRecord = Ext.data.Record.create([{
        name: 'name'
    }, {
        name: 'paxoff'
    }, {
        name: 'paxon'
    }, {
        name: 'loadoff'
    }, {
        name: 'loadon'
    }, {
        name: 'weight'
    }, {
        name: 'from'
    }, {
        name: 'to'
    }, {
    	name: 'clname'
    }]);

    var resvStore = new Ext.data.Store({
        data: reservations,
        reader: new Ext.data.JsonReader({
            id: 'reservationID'
        }, PatientRecord)
    });

    var acregs = [{
        code: 'AAAAA',
        name: 'PK-TPE',
        address: 'no addr',
        telephone: '020 7188 7188',
        fuel: 0,
        payload: 0,
        svctime: '00:00',
        pathcolor: 'red',
		startpos: 'SPG',
		endpos: 'CPU',
        assignment: [],
        revassignment: []
    }, {
        code: 'BBBBB',
        name: 'PK-TPF',
        address: 'no addr',
        telephone: '0115 924 9924',
        fuel: 0,
        payload: 0,
        svctime: '00:00',
        pathcolor: 'green',
		startpos: 'SPG',
		endpos: 'CPU',
        assignment: [],
        revassignment: []
    }, {
        code: 'CCCCC',
        name: 'PK-TPG',
        address: 'noaddr',
        telephone: '020 7377 7000',
        fuel: 0,
        payload: 0,
        svctime: '00:00',
        pathcolor: 'blue',
		startpos: 'SPG',
		endpos: 'CPU',
        assignment: [],
        revassignment: []
    }, {
        code: 'DDDDD',
        name: 'PK-TPD',
        address: 'noaddr',
        telephone: '020 7377 7000',
        fuel: 0,
        payload: 0,
        svctime: '00:00',
        pathcolor: 'yellow',
		startpos: 'SPG',
		endpos: 'CPU',
        assignment: [],
        revassignment: []
    }];

    var HospitalRecord = Ext.data.Record.create([{
        name: 'name'
    }, {
        name: 'fuel'
    }, {
        name: 'payload'
    }, {
        name: 'svctime'
    }, {
        name: 'pathcolor'
    }, {
        name: 'assignment'
    }, {
        name: 'revassignment'
    }, {
        name: 'startpos'
    }, {
        name: 'endpos'
    }, {
        name: 'loadtext'
    }
    ]);

    var acregStore = new Ext.data.Store({
        data: acregs,
        reader: new Ext.data.JsonReader({
            id: 'code'
        }, HospitalRecord)
    });
    
    dsReservation.load() ;
    
    var patientView = new Ext.grid.GridPanel( {
	    store: dsReservation,
	    height: 480,
	    stripeRows: true,
	    columns: [
	      {
	        header: 'Name',
	        dataIndex: 'DISPLAYNAME',
	        width: 50
	      },
	      {
	        header: 'Org',
	        dataIndex: 'ORG',
	        width: 30
	      },
	      {
	        header: 'Dest',
	        dataIndex: 'DEST',
	        width: 30
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
            render: initializePatientDragZone
        }
	  }) ; 

    //var patientView = new Ext.DataView({
    //    cls: 'patient-view',
    //    tpl: '<tpl for=".">' +
    //         '<div class="patient-source"><table><tbody>' +
    //             //'<tr><td class="{clname}">Name</td><td class="{clname}">From</td><td class="{clname}">To</td><td class="{clname}">Weight</td></tr>' +
    //             '<tr><td class="{clname}">{name}</td><td class="patient-name">{from}</td><td class="patient-name">{to}</td><td class="patient-name">{weight}</td></tr>' +
    //            // '<tr><td class="{clname}">From</td><td class="patient-name">{paxoff}</td><td class="patient-name">{loadon}</td></tr>' +
    //         '</tbody></table></div>' +
    //         '</tpl>',
	//	plugins : [
    //        new Ext.ux.DataViewTransition({
    //            duration  : 550,
    //            idProperty: 'id'
    //        })
    //    ],
    //    itemSelector: 'div.patient-source',
    //    overClass: 'patient-over',
    //    selectedClass: 'patient-selected',
    //    singleSelect: true,
	//	multiSelect: true,
    //    store: dsReservation,
    //    listeners: {
    //        render: initializePatientDragZone
    //    }
    //});

	// var tbar = new Ext.Toolbar({
    //    items  : ['Sort on these fields:', ''],
    //   // plugins: [new Ext.ux.ToolbarReorderer()],
        
    //   listeners: {
    //        scope    : this,
    //        reordered: function(button) {
    //            changeSortDirection(button, false);
    //        }
    //    }
    //});
	
	//new Ext.Panel({
    //    title: 'Animated DataView',
    //    layout: 'fit',
    //    items : patientView,
    //    height: 615,
    //    width : 800,
    //    tbar  : tbar
    //});

    var hospitalGrid = new Ext.grid.GridPanel({
        title: 'Fleet Assignment',
        region: 'east',
        height: 560,
        margins: '0 2 2 0',
        bbar: [{
            text: 'Scenario',
            handler: function() {
        		Ext.winScenario.show(this);
				var dom = Ext.get('scenarios');
				dom.applyStyles("position:absolute;top:100px;");

				var domShadow = Ext.query('.x-ie-shadow');
				Ext.get(domShadow).applyStyles("top:100px;");
            }
        }, {
        	text: 'Clear',
        	handler: function() {

        		for (var i=0; i<acregStore.data.items.length; i++) {
        			var rec = acregStore.data.items[i] ;

        			if (rec.data.assignment) {
        				for (var j=0; j<rec.data.assignment.length; j++) {
        					var recData = rec.data.assignment[j] ;

							if (j==0 && typeof (recData.returnpath) != 'undefined') {
								recData.returnpath.remove() ;
							}

							if (typeof (recData.overlay) != 'undefined')
								recData.overlay.remove() ;

        					recData.set ("clname","patient-label") ;
        					recData.commit () ;
        				}
        			}

        			rec.data.revassignment = null ;
        			rec.data.assignment = null ;

        			rec.set("fuel", 0) ;
        			rec.set("payload", 0) ;
        			rec.set("svctime","00:00") ;
        			rec.set("assignment", []) ;
        			rec.set("revassignment", []) ;
        			rec.set("loadtext", generateLoadTable()) ;

        			rec.commit () ;
        		}
        	}
        }, {
        	text: 'Configuration',
        	handler: function() {
        	}
        }],
        columns: [ {
			dataIndex: ' ',
            header: ' ',
			sortable: false,
            width: 30,
			renderer: renderCraftButton
		},{
            dataIndex: 'name',
            header: 'Reg No',
            width: 100
        }, {
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
        }],
        viewConfig: {
            tpl: new Ext.XTemplate('<div class="hospital-target" >'+
										'<div style="border:2px solid {pathcolor};width:384px;height:48px;margin:1px;padding:0px">' +
											'<table><tbody><tr>' +
											'<td width="313px">' +
												'<div style="border:1px solid {pathcolor};width:308px;height:46px;margin:0px;padding:1px">' +
													'<table class="heli-seating"><tbody>' +
														'{loadtext}'+
													'</tbody></table>' +
												'</div>' +
											'</td>'	+
											'<td>' +
												'<table><tbody><tr><td>' +
													'<div style="border:1px solid ;width:11px;height:11px;margin:0px;padding:0px">' +
													'1</div>' +
												'</td></tr><tr><td>' +
													'<div style="border:1px solid ;width:11px;height:11px;margin:0px;padding:0px">' +
													'1</div>' +
												'</td></tr><tr><td>' +
													'<div style="border:1px solid ;width:11px;height:11px;margin:0px;padding:0px">' +
													'1</div>' +
												'</td></tr>' +
												'</tbody></table>' +
											'</td>' +
											'</tr></tbody></table>' +
										'</div>' +
            		               '</div>'),
            enableRowBody: true,
            getRowClass: function(rec, idx, p, store) {
                p.body = this.tpl.apply(rec.data);
            }
        },
        store: acregStore,
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
            width: 140,
            height: 570,
            margins: '0 0 0 0',
            items: patientView
        }]
    });

    new Ext.Viewport({
        layout: 'border',
        applyTo: 'data2_canvas',
        items: [ {
        	region: 'center',
        	width: 450,
        	height: 580,
        	margins: '0 0 0 0',
            items: hospitalGrid
        }]
    });

}

function renderCraftButton (value, id, r) {
	var id = Ext.id();
	createGridButton.defer(10, this, ['', id, r]);
    // return('&lt;div id="' + id + '"&gt;&lt;/div&gt;');
	return('<div id="' + id + '"></div>');
}

function createGridButton(value, id, record) {
	new Ext.Button({
		text: value
		,iconCls: 'tabs'
		,handler : function(btn, e) {
			var NOT_ASSIGNED ;
			var assignment = record.data.assignment ;
            var revassignment = [] ;
            var newassignment = [] ;

			Ext.example.msg('Delete Fleet Assignment', 'Deleting assignment for {0}', record.data.name) ;
			for (i=0; i<assignment.length; i++) {
				if (typeof(assignment[i].overlay) != 'undefined') {
					assignment[i].overlay.remove() ;
					assignment[i].overlay = NOT_ASSIGNED ;
				}
				assignment[i].set ("clname","patient-label") ;
        		assignment[i].commit () ;
			}
			if (assignment.length>0) {
				if (typeof(assignment[0].returnpath) != 'undefined') {
					assignment[0].returnpath.remove() ;
					assignment[0].returnpath = NOT_ASSIGNED ;
				}
			}
			record.data.assignment = null ;
			record.data.revassignment = null ;

			record.set("fuel", 0) ;
			record.set("payload", 0) ;
			record.set("svctime","00:00") ;
			record.set("assignment", []) ;
			record.set("revassignment", []) ;
			record.set("loadtext", generateLoadTable()) ;

			record.commit () ;
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
	pts1.push (new GLatLng(port1pos.lat,port1pos.lng));
	pts1.push (new GLatLng(port2pos.lat,port2pos.lng));

	var poly1 = new BDCCArrowedPolyline(pts1,pathcol,4,0.3,null,30,7,pathcol,2,0.5,isbidirection);
	poly1.port1 = port1 ;
	poly1.port2 = port2 ;

 	Ext.gmap.addOverlay(poly1);
	return poly1 ;
}

function draw_assignment (startport, assignment, pathcolor) {
    var isbidirection = false ;
	// console.log ("assignment length = " + assignment.length) ;
	if (assignment.length == 1)  {  // set bidirection
		isbidirection = true ;
	}
	else if (assignment.length == 2) {
		// console.log ("draw_assignment, length = 2, typeof " + typeof(assignment[0].overlay)) ;
		if (typeof(assignment[0].overlay) != 'undefined' && assignment[0].overlay.isbidirection) {
			// console.log ("draw_assignment, do removal") ;
			port1 = assignment[0].overlay.port1 ;
			port2 = assignment[0].overlay.port2 ;

			assignment[0].overlay.remove () ;
			assignment[0].overlay = draw_curve(port1, port2, pathcolor, false) ;
			// console.log ("draw_assignment, done removal") ;
		}
	}

	if (typeof(assignment[0].returnpath) != 'undefined')
		assignment[0].returnpath.remove () ;



	assignment[assignment.length-1].overlay = draw_curve(startport, assignment[assignment.length-1].data.name, pathcolor, isbidirection) ;

	// draw return path
	if (assignment.length > 1) {
		port1 = assignment[assignment.length-1].data.name ;
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
function initializePatientDragZone(v) {
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
            		
                return v.dragData = {
                    sourceEl: sourceEl,
                    repairXY: Ext.fly(sourceEl).getXY(),
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

function generateLoadTable (assignment, loadfrombase) {
	var tmpl = '<td class="fuel-table">{0}</td>' ;
	var tmplspc = '<td class="fuel-table">&nbsp</td>' ;
	var fulltext1 = '<tr>' ;
	var fulltext2 = '<tr>' ;
	var fulltext3 = '<tr>' ;
	var legload = loadfrombase ;
	var assignmentlength = -1 ;

	if (typeof (assignment) != 'undefined')
		assignmentlength = assignment.length ;

	for (var i=0; i<10; i++) {
		if (i<assignmentlength) {
			if (i==0) {
				fulltext1 = fulltext1 + String.format(tmpl, 'SPG') ;        // default originator
				fulltext2 = fulltext2 + String.format(tmpl, loadfrombase) ;
				fulltext3 = fulltext3 + String.format(tmpl, '&nbsp') ;
			}
			loadfrombase = loadfrombase - assignment[i].data.loadon + assignment[i].data.loadoff ;
			fulltext1 = fulltext1 + String.format(tmpl, assignment[i].data.to) ;
			fulltext2 = fulltext2 + String.format(tmpl, loadfrombase) ;
			fulltext3 = fulltext3 + String.format(tmpl, '&nbsp') ;

			if (i==assignment.length-1) {
				fulltext1 = fulltext1 + String.format(tmpl, 'SPG') ;        // default destination
				fulltext2 = fulltext2 + String.format(tmpl, 0) ;
				fulltext3 = fulltext3 + String.format(tmpl, '&nbsp') ;
			}
		}
		else {
			fulltext1 = fulltext1 + tmplspc ;
			fulltext2 = fulltext2 + tmplspc ;
			fulltext3 = fulltext3 + tmplspc ;
		}
	}

	fulltext1 = fulltext1 + '</tr>' ;
	fulltext2 = fulltext2 + '</tr>' ;
	fulltext3 = fulltext3 + '</tr>' ;

	return fulltext1 + fulltext2 + fulltext3 ;
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

            if (h.data.revassignment[data.patientData.name] >= 0)
            	return false ;

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
            var targetEl = Ext.get(target);

            var org = data.patientData.ORG ;
            var dest = data.patientData.DEST ;
            var resvid = data.patientData.RESERVATIONID ;
            
			// check if the selected node has been visited by this aircraft
            // if (h.data.revassignment[data.patientData.name] >= 0)
            //	return false ;

            // check if the selected node has been involved in other aircraft
            var h1 = null ;
            var involved = false ;
            for (var j=0; j<g.getStore().totalLength; j++) {
            	if (j != rowIndex) {
            		h1 = g.getStore().getAt(j);
            		if (h1.data.revassignment[data.patientData.name] >= 0) {
                    	involved = true ;
                    	break ;
            		}
            	}
            }

            if (involved) {
            	// ask audience
            	Ext.MessageBox.show (
        			{
        				title: 'Move Assignment ?',
        				msg : 'You are assigning ' + data.patientData.name +' to different helicopter. <br/>Are you sure ?',
        				buttons: Ext.MessageBox.YESNO,
        				fn: function(btn) {
        					Ext.example.msg('Assignment Modification', 'Moving {0} to {1}', data.patientData.name, h.data.name);
        					if (btn == 'yes') {
        						removeroute () ;
        						assignroute () ;
        					}
        				},
        				icon: Ext.MessageBox.QUESTION
        			}
            	) ;
            }
            else
            	assignroute () ;


            function calculateload (assignment) {
            	var loadfrombase = 0 ;
            	var loadtobase = 0 ;
            	for (var i=0; i<assignment.length; i++) {
            		loadfrombase = loadfrombase + assignment[i].data.weight ;
            		loadtobase = loadtobase + assignment[i].data.weight ;
            	}
            	return {loadfrombase: loadfrombase, loadtobase: loadtobase} ;
            }

			// remove a port from a route
			// port = data.patientData.name
            function removeroute () {
			    var NOT_ASSIGNED ;
				var overlay ;
				var port1 ;
				var port2 ;
            	var hqidx = h1.data.revassignment[data.patientData.name] ;
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
            		revassignment[oldassignment[i].data.name] = i ;
            		newassignment[i] = oldassignment[i] ;

	            	if (i<h.data.assignment.length-1)
	            		startport = oldassignment[i].data.name ;
            	}

            	oldassignment = null ;

            	h1.data.assignment = newassignment ;
            	h1.data.revassignment = revassignment ;

            	var payload = calculateload(h1.data.assignment) ;
            	var loadtext = generateLoadTable(h1.data.assignment, payload.loadfrombase) ;
            	h1.set ("payload", payload.loadfrombase) ;
            	h1.set ("loadtext", loadtext) ;
            	h1.commit () ;
            }

            function assignroute () {
            	// put assignment here
            	
            	var acreg = h.data.name ;

            	EditorBean.assignFleetAtEnd(acreg,resvid,function(retval, e) {
            		if (typeof (retval) != 'undefined') {
						var result = retval['result'] ;
						if (result)
							Ext.example.msg('Assignment', 'Assignment return route : {0}', result) ;
						var err = retval['err'] ;
						if (err)
							Ext.example.msg('Assignment', 'Assignment return error : {0}', err) ;
            		}
				}) ;
            	
	            h.data.revassignment[dest] = h.data.assignment.length ;
	            h.data.assignment[h.data.assignment.length] = data.recData ;

	            data.recData.set ("clname","patient-label-assigned") ;

	            var startport = "SPG" ;
	            for (var i=0; i<h.data.assignment.length; i++) {
	            	if (i<h.data.assignment.length-1)
	            		startport = h.data.assignment[i].data.DEST ;
	            }

				draw_assignment(startport, h.data.assignment, h.data.pathcolor) ;

	            h.data.targetEl = targetEl ;
	            var payload = calculateload(h.data.assignment) ;
	            var loadtext = generateLoadTable(h.data.assignment, payload.loadfrombase) ;
	            h.set ("payload", payload.loadfrombase) ;
	            h.set ("loadtext", loadtext) ;

	            h.commit () ;
            }

            return true;
        }
    });
}



Ext.onReady(function(){
	Ext.talian.REMOTING_API.enableBuffer = 0;
   	var remotingProvider = Ext.Direct.addProvider( Ext.talian.REMOTING_API);
   	
   	Djn.RemoteCallSupport.addCallValidation(remotingProvider);
    Djn.RemoteCallSupport.validateCalls = true;


    var mapcanvas = document.getElementById("map_canvas")

    Ext.portarray = new Array();

    var map = new GMap2(mapcanvas);
    map.addControl(new GSmallMapControl());
    map.addControl(new GMapTypeControl());
    map.setCenter(new GLatLng(-0.833889,117.300647), 9);
    Ext.gmap = map ;

    // Create a base icon for all of our markers that specifies the
    // shadow, icon dimensions, etc.
    var baseIcon = new GIcon(G_DEFAULT_ICON);
    baseIcon.iconSize = new GSize(20, 20);
    baseIcon.shadowSize = new GSize(20, 2);
    baseIcon.iconAnchor = new GPoint(9, 32);
    baseIcon.infoWindowAnchor = new GPoint(9, 2);

    // Creates a marker whose info window displays the letter corresponding
    // to the given index.
    function createMarker(point, index, label) {
      // Create a lettered icon for this point using our icon class
      var myIcon = new GIcon(baseIcon);
      myIcon.image = "/coco001/webclient/images/heliportsimple.png";

      // Set up our GMarkerOptions object
      markerOptions = { icon:myIcon, title:label };
      var marker = new GMarker(point, markerOptions);
      marker.title = label ;

      GEvent.addListener(marker, "click", function() {
        marker.openInfoWindowHtml("Heliport <b>" + marker.title + "</b>");
      });
      return marker;
    }

    var ports = [
    { lat:-0.833889, lng:117.250647, label: "HDL"},
	{ lat:-0.580395, lng:117.375968, label: "CPU"},
	{ lat:-0.814271, lng:117.499396, label: "RSA"},
	{ lat:-0.399215, lng:117.576747, label: "HIB"},
	{ lat:-0.388155, lng:117.616122, label: "RIS"},
	{ lat:-1.275833, lng:116.885000, label: "SPG"},
	{ lat:-1.057222, lng:117.350556, label: "RAN"},
	{ lat:-0.685000, lng:117.504722, label: "SPU"},
	{ lat:-0.685000, lng:117.504722, label: "SPU1"},
	{ lat:-1.013889, lng:117.503056, label: "BKP"},
	{ lat:-0.452213, lng:117.589092, label: "NPU"},
	{ lat:-0.954373, lng:117.332171, label: "PAR"},
	{ lat:-0.759167, lng:117.785278, label: "GJD"},
	{ lat:-0.966667, lng:117.133333, label: "SNP"},
	{ lat:-0.984722, lng:117.509167, label: "SOE"},
	{ lat:-0.662848, lng:117.499275, label: "YAN"}
	];


    // Add 10 markers to the map at random locations
    for (var i = 0; i < ports.length; i++) {
       var point = new GLatLng(ports[i].lat, ports[i].lng) ;
       map.addOverlay(createMarker(point, i, ports[i].label));

       Ext.portarray[ports[i].label] = ports[i] ;
    }

    Ext.winScenario = new Ext.Window({
        applyTo:'scenarios',
        layout:'fit',
        position:'absolute',
		width:500,
        height:300,
		top:400,
        closeAction:'hide',
        plain: true,

        items: new Ext.TabPanel({
            applyTo: 'hello-tabs',
            autoTabs:true,
            activeTab:0,
            deferredRender:false,
            border:false
        }),

        buttons: [{
            text:'Select',
			handler: function(){
					EditorBean.assignPing('PK-AAA','RESV1234',function(result, e) {
						var s123 = result['123'] ;
						var s180 = result['180'] ;
						alert('result = ' + s123 + '-' +s180) ;
					}) ;
			}
        },{
            text: 'Close',
            handler: function(){
        		try {
        			Ext.winScenario.hide();
        		}
        		catch (e) {
        			console.log ("Error : " + e) ;
        		}
            }
        }]
    });


    drageanddropzone() ;

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
    var rdrw = GEvent.callback(this,this.recalc );
  	this.lstnMoveEnd = GEvent.addListener(map,"zoomend",function(){rdrw ();});
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
    return;//do nothing, the GPolyline line and heads draw themselves
}


BDCCArrowedPolyline.prototype.copy = function(map) {
    return new BDCCArrowedPolyline(this.points,this.color,this.weight,this.opacity,this.opts,this.gapPx, this.headLength, this.headColor, this.headWeight, this.headOpacity, this.isbidirection);
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
