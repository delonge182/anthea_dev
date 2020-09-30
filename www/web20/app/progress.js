Ext.onReady(function(){
    var prov = Ext.Direct.addProvider(
        Ext.talian.REMOTING_API,
        {
            type:'polling',
            url: Ext.talian.POLLING_URLS.log
        }
    );

    var out = new Ext.form.DisplayField({
        cls: 'x-form-text',
        id: 'out'
    });
    
    out.render(Ext.getBody()) ;

    Ext.Direct.on('log', function(e){
        out.append(String.format('<p><i>{0}</i></p>', e.data));
                out.el.scroll('b', 100000, true);
    });
    
    // observe that thing
    Ext.util.Observable.capture(prov, function() {
        console.log("event '" + arguments[0] + "' was fired with the following arguments: ");
        for (var i = 1; i < arguments.length; i++) {
           console.log("        [" + i + "] ", arguments[i]);
        }
    });

});
