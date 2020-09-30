/*!
 * Ext JS Library 3.2.1
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */


function raph_curve(x, y, ax, ay, bx, by, zx, zy, color) {
	var paper = Ext.paper ;
	var discattr = {fill: "red", stroke: "none"};
	var ctrlattr = {fill: "none", stroke: "yellow"};
    var path = [["M", x, y], ["C", ax, ay, bx, by, zx, zy]],
        path2 = [["M", x, y], ["L", ax, ay], ["M", bx, by], ["L", zx, zy]],
        curve = paper.path(path).attr({stroke: color || Raphael.getColor(), "stroke-width": 4, "stroke-linecap": "round"}),
        controls = paper.set(
            paper.path(path2).attr({stroke: "#ccc", "stroke-dasharray": ". "}),
            paper.circle(x, y, 5).attr(discattr),
            paper.circle(ax, ay, 5).attr(ctrlattr),
            paper.circle(bx, by, 5).attr(ctrlattr),
            paper.circle(zx, zy, 5).attr(discattr)
        );
    controls[1].update = function (x, y) {
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        path[0][1] = X;
        path[0][2] = Y;
        path2[0][1] = X;
        path2[0][2] = Y;
        controls[2].update(x, y);
    };
    controls[2].update = function (x, y) {
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        path[1][1] = X;
        path[1][2] = Y;
        path2[1][1] = X;
        path2[1][2] = Y;
        curve.attr({path: path});
        controls[0].attr({path: path2});
    };
    controls[3].update = function (x, y) {
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        path[1][3] = X;
        path[1][4] = Y;
        path2[2][1] = X;
        path2[2][2] = Y;
        curve.attr({path: path});
        controls[0].attr({path: path2});
    };
    controls[4].update = function (x, y) {
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        path[1][5] = X;
        path[1][6] = Y;
        path2[3][1] = X;
        path2[3][2] = Y;
        controls[3].update(x, y);
    };
    controls.drag(raph_move, raph_up);
}
function raph_move(dx, dy) {
    this.update(dx - (this.dx || 0), dy - (this.dy || 0));
    this.dx = dx;
    this.dy = dy;
}

function raph_up() {
    this.dx = this.dy = 0;
}

function drageanddropzone () {

    var patients = [{
        insuranceCode: '11111',
        name: 'CPU',
        address: 'Main Street',
        telephone: '555 1234 123',
        paxoff: 10,
        paxon:  5,
        loadoff: 775,
        loadon:  350,
        clname: 'patient-label'
    }, {
        insuranceCode: '22222',
        name: 'NPU',
        paxoff: 2,
        paxon:  2,
        loadoff: 180,
        loadon:  160,
        clname: 'patient-label'
    }, {
        insuranceCode: '33333',
        name: 'S136',
        paxoff: 2,
        paxon:  0,
        loadoff: 150,
        loadon:  0,
        clname: 'patient-label'
    }, {
        insuranceCode: '44444',
        name: 'PAR',
        paxoff: 2,
        paxon:  1,
        loadoff: 180,
        loadon:  75,
        clname: 'patient-label'
    }, {
        insuranceCode: '55555',
        name: 'MRA',
        paxoff: 1,
        paxon:  0,
        loadoff: 90,
        loadon:   0,
        clname: 'patient-label'
    }, {
        insuranceCode: '66666',
        name: 'ENS1',
        paxoff: 1,
        paxon:  1,
        loadoff: 80,
        loadon:  75,
        clname: 'patient-label'
    }, {
        insuranceCode: '77777',
        name: 'HIB',
        paxoff: 4,
        paxon:  5,
        loadoff: 340,
        loadon:  400,
        clname: 'patient-label'
    }];

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
    	name: 'clname'
    }]);

    var patientStore = new Ext.data.Store({
        data: patients,
        reader: new Ext.data.JsonReader({
            id: 'insuranceCode'
        }, PatientRecord)
    });

    var hospitals = [{
        code: 'AAAAA',
        name: 'PK-TSW',
        address: 'Westminster Bridge Road, SE1 7EH',
        telephone: '020 7188 7188',
        fuel: 0,
        payload: 0,
        svctime: '00:00',
        pathcolor: 'red',
        assignment: [],
        revassignment: [],
        routetext: 'Drop here'
    }, {
        code: 'BBBBB',
        name: 'PK-TSX',
        address: 'Derby Road, NG7 2UH',
        telephone: '0115 924 9924',
        fuel: 0,
        payload: 0,
        svctime: '00:00',
        pathcolor: 'green',
        assignment: [],
        revassignment: [],
        routetext: 'Drop here'
    }, {
        code: 'CCCCC',
        name: 'PK-TSH',
        address: 'West Smithfield, EC1A 7BE',
        telephone: '020 7377 7000',
        fuel: 0,
        payload: 0,
        svctime: '00:00',
        pathcolor: 'blue',
        assignment: [],
        revassignment: [],
        routetext: 'Drop here'
    }, {
        code: 'DDDDD',
        name: 'PK-TSI',
        address: 'Whitechapel, E1 1BB',
        telephone: '020 7377 7000',
        fuel: 0,
        payload: 0,
        svctime: '00:00',
        pathcolor: 'brown',
        assignment: [],
        revassignment: [],
        routetext: 'Drop here'
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
        name: 'routetext'
    }, {
        name: 'loadtext'
    }
    ]);

    var hospitalStore = new Ext.data.Store({
        data: hospitals,
        reader: new Ext.data.JsonReader({
            id: 'code'
        }, HospitalRecord)
    });
    
    var patientView = new Ext.DataView({
        cls: 'patient-view',
        tpl: '<tpl for=".">' +
             '<div class="patient-source"><table><tbody>' +
                 '<tr><td class="{clname}">{name}</td><td class="{clname}">Pax</td><td class="{clname}">Load</td></tr>' +
                 '<tr><td class="{clname}">To</td><td class="patient-name">{paxoff}</td><td class="patient-name">{loadoff}</td></tr>' +
                 '<tr><td class="{clname}">From</td><td class="patient-name">{paxon}</td><td class="patient-name">{loadon}</td></tr>' +
             '</tbody></table></div>' +
             '</tpl>',
        itemSelector: 'div.patient-source',
        overClass: 'patient-over',
        selectedClass: 'patient-selected',
        singleSelect: true,
        store: patientStore,
        listeners: {
            render: initializePatientDragZone
        }
    });

    var hospitalGrid = new Ext.grid.GridPanel({
        title: 'Fleet Assignment',
        region: 'east',
        height: 600,
        margins: '0 2 2 0',
        bbar: [{
            text: 'Scenario',
            handler: function() {
        		Ext.winScenario.show(Ext._shthis);               
            }
        }, {
        	text: 'Clear',
        	handler: function() {
        		Ext.paper.clear () ;
        		
        		for (var i=0; i<hospitalStore.data.items.length; i++) {
        			var rec = hospitalStore.data.items[i] ;
        			
        			if (rec.data.assignment) {
        				for (var j=0; j<rec.data.assignment.length; j++) {
        					var recData = rec.data.assignment[j] ;
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
        			rec.set("routetext", "Drop here") ;
        			rec.set("loadtext", "") ;
        			
        			rec.commit () ;
        			
        			if (rec.data.targetEl) {
        				rec.data.targetEl.update ("Drop Here") ;
        			}
        		}
        	}
        }, {
        	text: 'Configuration',
        	handler: function() {
        	}
        }],
        columns: [{
            dataIndex: 'name',
            header: 'Reg No',
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
            tpl: new Ext.XTemplate('<div class="hospital-target" ><table><tbody>'+
            						   '<tr><td>' +	
            		                   		'<div style="border: 1px solid {pathcolor};width:300ps;height:16px;margin:1px;padding:5px">{routetext}</div>' +
            						   '</td></tr>' +
            						   '<tr><td>' +	
       		                   		        '<div style="border:1px solid;width:300ps;height:48px;margin:1px;padding:5px">' + 
       		                   		        	'<table ><tbody>' +
	       		                   		        	'{loadtext}'+
       		                   		        	'</tbody></table>' +
       		                   		        '</div>' +
       		                   		  '</td></tr>' +
            		               '</tbody></table></div>'),
            enableRowBody: true,
            getRowClass: function(rec, idx, p, store) {
                p.body = this.tpl.apply(rec.data);
            }
        },
        store: hospitalStore,
        listeners: {
            render: initializeHospitalDropZone
        }
    });
    
    //function renderAssignment(value, p, record){
    //	var ganttpaper = record.data.gantt ;
    //	if (ganttpaper)
    //		ganttpaper = 0 ;
    //	
    //   return String.format(
    //            '<div style="height:30" id=__gantt__{0}></div>', record.data.name);
    //}
    
    //var ganttGrid = new Ext.grid.GridPanel({
    //    region: 'west',
    //    height: 400,
    //    margins: '0 2 2 0',
    //    columns: [{
    //        dataIndex: 'name',
    //        header: 'Reg No',
    //        width: 60
    //    }, {
    //        dataIndex: 'svctime',
    //        header: 'Svc Time',
    //        width: 40
    //    }, {
    //    	dataIndex: 'assignment',
    //    	header: 'Time-line',
    //    	width: 900,
    //    	renderer: renderAssignment
    //    }],
    //    store: hospitalStore
    //}) ;


    new Ext.Viewport({
        layout: 'border',
        applyTo: 'data1_canvas',
        items: [ {
            title: 'From/To SPG',
            region: 'west',
            width: 150,
            height: 600,
            margins: '0 2 2 2',
            items: patientView
        }]
    });

    new Ext.Viewport({
        layout: 'border',
        applyTo: 'data2_canvas',
        items: [ {
        	region: 'center',
        	width: 450,
        	height: 600,
        	items: hospitalGrid
        }]
    });

    //var ganttView = new Ext.Viewport({
    //    layout: 'border',
    //    applyTo: 'data3_canvas',
    //    items: [ {
    //    	region: 'center',
    //    	width: 1004,
    //   	height: 400,
    //    	items: ganttGrid
    //    }]
    //});
    
    //function ganttRender () {
    //    for (var i=0; i<hospitalStore.data.length; i++) {
    //    	var record = hospitalStore.data.items[i] ;
    //    	var ganttpaper = Raphael("__gantt__" + record.data.name) ;
    //    	record.set("gantt", ganttpaper) ;
    //    	ganttpaper.Text ("testing").attr("stroke:blue") ;
    //    }
	// }
    
    // ganttView.on('render', ganttRender, this, {delay:10});   

}

function draw_curve (port1, port2, pathcol, isleft) {
	var port1pos = Ext.portarray[port1] ;
	var port2pos = Ext.portarray[port2] ;
	
	var p1 = Ext.gmap.fromLatLngToDivPixel (new GLatLng(port1pos.lat,port1pos.lng)) ;
	var p2 = Ext.gmap.fromLatLngToDivPixel (new GLatLng(port2pos.lat,port2pos.lng)) ;
	
	raph_curve(p1.x, p1.y, p1.x+30, p1.y, p2.x+30, p2.y, p2.x, p2.y, pathcol);
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
                return v.dragData = {
                    sourceEl: sourceEl,
                    repairXY: Ext.fly(sourceEl).getXY(),
                    ddel: d,
                    patientData: v.getRecord(sourceEl).data,
                    recData: v.getRecord(sourceEl)
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
                        
            if (h.data.revassignment[data.patientData.name] >= 0)
            	return false ;
            
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
        				msg : 'You are assigning ' + data.patientData.name +'to different heli. <br/>Are you sure ?',
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
            
            function generateLoadTable (assignment, loadfrombase) {
            	var tmpl = '<td class="fuel-table">{0}</td>' ;
            	var tmplspc = '<td class="fuel-table">&nbsp</td>' ;
            	var fulltext1 = '<tr>' ;
            	var fulltext2 = '<tr>' ;
            	var fulltext3 = '<tr>' ;
            	var legload = loadfrombase ;
            	
            	for (var i=0; i<9; i++) {
            		if (i<assignment.length) {
            			if (i==0) {
            				fulltext1 = fulltext1 + String.format(tmpl, 'SPG') ;        // default originator
            				fulltext2 = fulltext2 + String.format(tmpl, loadfrombase) ; 
            				fulltext3 = fulltext3 + String.format(tmpl, '&nbsp') ;
            			}
            			loadfrombase = loadfrombase - assignment[i].data.loadoff + assignment[i].data.loadon ;
        				fulltext1 = fulltext1 + String.format(tmpl, assignment[i].data.name) ;        
        				fulltext2 = fulltext2 + String.format(tmpl, loadfrombase) ; 
        				fulltext3 = fulltext3 + String.format(tmpl, '&nbsp') ;
        				
        				if (i==assignment.length-1) {
                    		fulltext1 = fulltext1 + String.format(tmpl, 'SPG') ;        // default originator
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
            
            function calculateload (assignment) {
            	var loadfrombase = 0 ;
            	var loadtobase = 0 ;
            	for (var i=0; i<assignment.length; i++) {
            		loadfrombase = loadfrombase + assignment[i].data.loadoff ;
            		loadtobase = loadtobase + assignment[i].data.loadon ;
            	}
            	return {loadfrombase: loadfrombase, loadtobase: loadtobase} ;
            }
            
            function removeroute () {
            	var hqidx = h1.data.revassignment[data.patientData.name] ;
            	var oldassignment = h1.data.assignment ;
            	h1.data.revassignment = null ;
            	h1.data.assignment = null ;
            	
            	oldassignment.splice (hqidx, 1) ;
            	// rebuild revassignment
            	var revassignment = [] ;
            	var newassignment = [] ;
	            var txtdom = "" ;
	            var startport = "SPG" ;

            	for (var i=0; i<oldassignment.length; i++) {
            		revassignment[oldassignment[i].data.name] = i ;
            		newassignment[i] = oldassignment[i] ;
            		
	            	if (i>0)
	            		txtdom = txtdom + "-" ;
	            	txtdom = txtdom + oldassignment[i].data.name ;
	            	if (i<h.data.assignment.length-1)
	            		startport = oldassignment[i].data.name ;
            	}
            	if (txtdom == "")
            		txtdom = "Drop here" ;
            	
            	oldassignment = null ;
            	
            	h1.data.assignment = newassignment ;
            	h1.data.revassignment = revassignment ;
            	            	
            	h1.set ("routetext", txtdom) ;
            	
            	var payload = calculateload(h1.data.assignment) ;
            	var loadtext = generateLoadTable(h1.data.assignment, payload.loadfrombase) ;
            	h1.set ("payload", payload.loadfrombase) ;
            	h1.set ("loadtext", loadtext) ;
            	h1.commit () ;
            }
            
            function assignroute () { 
	            h.data.revassignment[data.patientData.name] = h.data.assignment.length ;
	            h.data.assignment[h.data.assignment.length] = data.recData ;
	           
	            data.recData.set ("clname","patient-label-assigned") ;
	            
	            var txtdom = "" ;
	            var startport = "SPG" ;
	            for (var i=0; i<h.data.assignment.length; i++) {
	            	if (i>0)
	            		txtdom = txtdom + "-" ;
	            	txtdom = txtdom + h.data.assignment[i].data.name ;
	            	if (i<h.data.assignment.length-1)
	            		startport = h.data.assignment[i].data.name ;
	            }
	        	
	        	draw_curve(startport, h.data.assignment[h.data.assignment.length-1].data.name, h.data.pathcolor) ;
	
	            targetEl.update(txtdom);
	            
	            h.data.targetEl = targetEl ;
	            var payload = calculateload(h.data.assignment) ;
	            var loadtext = generateLoadTable(h.data.assignment, payload.loadfrombase) ;
	            h.set ("payload", payload.loadfrombase) ;
	            h.set ("loadtext", loadtext) ;
	            h.set ("routetext", txtdom) ;
	            
	            h.commit () ;
            }
                        
            return true;
        }
    });
}



Ext.onReady(function(){
    var mapcanvas = document.getElementById("map_canvas")
    
    Ext._shthis = this ;
    
    Ext.paper = null ;
    Ext.portarray = new Array();
        
    var map = new GMap2(mapcanvas);
    map.addControl(new GSmallMapControl());
    map.addControl(new GMapTypeControl());
    map.setCenter(new GLatLng(-0.833889,117.250647), 9);
    Ext.gmap = map ;
    
    // Create a base icon for all of our markers that specifies the
    // shadow, icon dimensions, etc.
    var baseIcon = new GIcon(G_DEFAULT_ICON);
    baseIcon.shadow = "http://www1.talian.net:9001/busunit/webclient/images/helicopter.shadow.png";
    baseIcon.iconSize = new GSize(20, 32);
    baseIcon.shadowSize = new GSize(37, 32);
    baseIcon.iconAnchor = new GPoint(9, 32);
    baseIcon.infoWindowAnchor = new GPoint(9, 2);

    // Creates a marker whose info window displays the letter corresponding
    // to the given index.
    function createMarker(point, index, label) {
      // Create a lettered icon for this point using our icon class
      var myIcon = new GIcon(baseIcon);
      myIcon.image = "http://www1.talian.net:9001/busunit/webclient/images/heliport.png";

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
	{ lat:-1.062895, lng:117.373450, label: "S136"},
	{ lat:-0.814271, lng:117.499396, label: "RSA"},
	{ lat:-0.399215, lng:117.576747, label: "HIB"},
	{ lat:-0.388155, lng:117.616122, label: "RIS"},
	{ lat:-1.262671, lng:116.898779, label: "SPG"},
	{ lat:-0.452213, lng:117.589092, label: "NPU"},
	{ lat:-0.993618, lng:117.506915, label: "BP1"},
	{ lat:-0.954373, lng:117.332171, label: "PAR"},
	{ lat:-0.966667, lng:117.133333, label: "SNP"},
	{ lat:-0.591366, lng:117.579706, label: "GTSA"},
	{ lat:-0.847506, lng:117.281977, label: "SRX"},
	{ lat:-0.612215, lng:117.543269, label: "ENS1"},
	{ lat:-0.662848, lng:117.499275, label: "YAN"},
	{ lat:-0.514209, lng:117.528974, label: "MRA"}	
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
        width:500,
        height:300,
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
            disabled:true
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
        
    // var rcanvas = Ext.get('raph_canvas'); 
    // var styles = 'position: absolute; top: -100000px; left: -100000px;' 
    // Ext.DomHelper.applyStyles(rcanvas, styles); 
    
    // create the window on the first click and reuse on subsequent clicks
    Ext.paper = Raphael("raph_canvas", 500, 500) ;    
    Ext.curves = [];
    
    
    var rsvData = {
    		records : [
    			{ dest : "CPU", paxoff : 10, weightoff : 775, paxon : 5, weighton : 350 },
    			{ dest : "NPU", paxoff : 2, weightoff : 180, paxon : 2, weighton : 160 },
    			{ dest : "S136", paxoff : 1, weightoff : 150, paxon : 0, weighton : 0 },
    			{ dest : "PAR", paxoff :  2, weightoff : 180, paxon : 1, weighton : 75 },
    			{ dest : "MRA", paxoff :  1, weightoff : 90, paxon : 0, weighton : 0 },
    			{ dest : "ENS1", paxoff : 1, weightoff : 80, paxon : 1, weighton : 75 },
    			{ dest : "HIB", paxoff :  4, weightoff : 340, paxon : 5, weighton : 400 }
    		]
    	};
    
	// Generic fields array to use in both store defs.
	var fields1 = [
		{name: 'dest', mapping : 'dest'},
		{name: 'paxoff', mapping : 'paxoff'},
		{name: 'weightoff', mapping : 'weightoff'},
		{name: 'paxon', mapping : 'paxon'},
		{name: 'weighton', mapping : 'weighton'}
	];
	
    // create the data store
    var firstGridStore = new Ext.data.JsonStore({
        fields : fields1,
		data   : rsvData,
		root   : 'records'
    });
    
    drageanddropzone() ;

 });