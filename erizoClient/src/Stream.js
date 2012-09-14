/*
 * Class Stream represents a local or a remote Stream in the Room. It will handle the WebRTC stream
 * and identify the stream and where it should be drawn.
 */
var Stream = function (spec) {
    "use strict";
    var that = EventDispatcher(spec);
    that.stream = spec.stream;
    that.room = undefined;
    that.showing = false;
    that.local = false;
    if (spec.local === undefined || spec.local === true) {
        that.local = true;
    }

    // Public functions

    that.getID = function() {
        return spec.streamID;
    };

    that.getAttributes = function() {
        return spec.attributes;
    };

    // Indicates if the stream has audio activated
    that.hasAudio = function () {
        return spec.audio;
    };

    // Indicates if the stream has video activated
    that.hasVideo = function () {
        return spec.video;
    };

    // Indicates if the stream has video activated
    that.hasData = function () {
        return spec.data;
    };

    // Sends data through this stream.
    that.sendData = function(msg) {};

    // Initializes the stream and tries to retrieve a stream from local video and audio
    // We need to call this method before we can publish it in the room.
    that.init = function () {
        try {
            if (spec.audio || spec.video) {
                navigator.webkitGetUserMedia({video: spec.video, audio: spec.audio}, function (stream) {
                    
                    L.Logger.info("User has granted access to local media.");
                    that.stream = stream;

                    var streamEvent = StreamEvent({type: "access-accepted"});
                    that.dispatchEvent(streamEvent);

                }, function (error) {
                    L.Logger.error("Failed to get access to local media. Error code was " + error.code + ".");
                });
                L.Logger.debug("Requested access to local media");
            } else {
                var streamEvent = StreamEvent({type: "access-accepted"});
                that.dispatchEvent(streamEvent);
            }
        } catch (e) {
            L.Logger.error("Error accessing to local media");
        }
    };

    that.show = function(elementID) {
        that.elementID = elementID;
        if (that.hasVideo()) {
            // Draw on HTML
            if (elementID !== undefined) {
                var player = new VideoPlayer({id: that.getID(), stream: that.stream, elementID: elementID});
                that.player = player;
                that.showing = true;
            }
        }
    };

    that.hide = function() {
        if (that.showing) {
            if (that.player !== undefined) {
                that.player.destroy();
                that.showing = false;
            }
        }
    }

    return that;
};