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

    return ips[0];
}

var currentTab
var rawUrl
var rawTitle
var ipUrl

function createQRCode (url) {
    $('#qrUrl').val(url)
    $('#qrDiv').html('').qrcode({
        text: url,
        width: 160,
        height: 160
    })
}

function addFocusSelect (selector) {
    $(selector).focus(function () {
        $(this).select()
    }).mouseup(function (e) {
        e.preventDefault()
    })
}

function updateQR () {
    createQRCode(useTranslate ? ipUrl : rawUrl)
}

var storageKeyUseTranslate = 'qrcode-option-use-translate'
var useTranslate = localStorage.getItem(storageKeyUseTranslate) === 'true'
$('#useTranslate').prop('checked', useTranslate) 
$('#useTranslate').on('change', e => {
    useTranslate = e.currentTarget.checked
    localStorage.setItem(storageKeyUseTranslate, useTranslate)
    updateQR()
})

addFocusSelect('#qrTitle')
addFocusSelect('#qrUrl')

//  选中小图标
chrome.tabs.getSelected(null, function (tab) {
    currentTab = tab
    ipUrl = rawUrl = tab.url
    rawTitle = tab.title
    $('#qrTitle').val(rawTitle)
    $('#qrUrl').val(rawUrl)
    getLocalIPs(function (ips) {
        var ip = getLocalIP(ips)
        ipUrl = rawUrl.replace('http://localhost', 'http://' + ip)
        ipUrl = ipUrl.replace('http://127.0.0.1', 'http://' + ip)
        updateQR()
    })
})