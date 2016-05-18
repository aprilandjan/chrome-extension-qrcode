jQuery(function(){
	$("#btn_gen").live("click",function(){
		jQuery('#qrDiv').html("");
		jQuery('#qrDiv').qrcode({
			text	: $("#qr_website").val()	//根据辞串生成第一个二维码
		});
	});
});

function getLocalIPs(callback) {
    var ips = [];

    var RTCPeerConnection = window.RTCPeerConnection ||
        window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    
    var pc = new RTCPeerConnection({
        // Don't specify any stun/turn servers, otherwise you will
        // also find your public IP addresses.
        iceServers: []
    });
    // Add a media line, this is needed to activate candidate gathering.
    pc.createDataChannel('');

    // onicecandidate is triggered whenever a candidate has been found.
    pc.onicecandidate = function(e) {
        if (!e.candidate) { // Candidate gathering completed.
            pc.close();
            callback(ips);
            return;
        }
        var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
        if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
            ips.push(ip);
    };
    pc.createOffer(function(sdp) {
        pc.setLocalDescription(sdp);
    }, function onerror() {});
}

function getLocalIP(ips){
    for(var i = 0; i < ips.length; i ++){
        var ip = ips[i];
        if(ip.indexOf('192.168') != -1){
            return ip;
        }
    }

    return '';
}

//  选中小图标
chrome.tabs.getSelected(null,function(w){

    var url = w.url;

    //  localhost
    if(url.indexOf('http://localhost') == 0){
        getLocalIPs(function(ips){
            var ip = this.getLocalIP(ips);
            url = url.replace('http://localhost', 'http://' + ip);

            jQuery('#qrDiv').qrcode({
                text	: url,
                width:"160",
                height:"160"
            });
            $("#qr_webname").val(w.title);
            $("#qr_website").val(url);
        })
    }
    else{
        jQuery('#qrDiv').qrcode({
            text	: w.url,
            width:"160",
            height:"160"
        });
        $("#qr_webname").val(w.title);
        $("#qr_website").val(w.url);
    }
});