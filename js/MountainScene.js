(function(window) {
    // Structure borrowed from: 
    // http://checkman.io/blog/creating-a-javascript-library/
    // This is the "module pattern".
    'use strict';
    function define_library() {
        var MountTam = {};

        // Private variables.
        var mHolder = null;
        var mCanvas = null;
        var canvasWidth = 190;
        var canvasHeight = 72;
        var foregroundClass = 'mountainForeground';
        var cloudClass = 'mountainClouds';

        // A 'private' method.
        function mountainHolderTemplate(width, height) {
            return `<img class="${foregroundClass}" src="Cloudy_Mountain.png" />
                <img class="${cloudClass}" src="Cloud_01.png" />
                <img class="${cloudClass}" src="Cloud_02.png" />
                <canvas width="${width}" height="${height}"></canvas>
                <button>Render Test Mountain</button>`
        };

        function createMountainHolder(holderID) {
            mHolder = document.createElement('div');
            mHolder.id = holderID;
            mHolder.innerHTML = mountainHolderTemplate(canvasWidth, canvasHeight);
            mCanvas = mHolder.querySelectorAll('canvas')[0];
            mHolder.querySelectorAll('button')[0].addEventListener("click", function (event) {
                event.stopPropagation();
                event.preventDefault();
                 MountTam.drawAndReturnSceneOnCanvas(mCanvas);
            }, false);
            document.body.appendChild(mHolder);
        }

        function getRandomIntInclusive(min, max) {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function drawCloud(canvasEl, ctx, cloud) {
            var possibleWidth = canvasEl.width + Math.floor(cloud.width / 4);
            var possibleHeight = Math.floor(canvasEl.height / 4);
            var randX = getRandomIntInclusive(0, possibleWidth);
            var x = randX - Math.floor(cloud.width / 4);
            var y = getRandomIntInclusive(0, possibleHeight);
            ctx.drawImage(cloud, x, y);
        }

        function drawScene(canvasEl, ctx) {
            var mountain = mHolder.querySelectorAll('img.mountainForeground')[0];
            var clouds = mHolder.querySelectorAll('img.mountainClouds');
            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
            for (var i = 0; i < clouds.length; i++) {
                drawCloud(canvasEl, ctx, clouds[i]);
            }
            // Transparency to see where the clouds are hiding.
            // ctx.globalAlpha = 0.4;
            ctx.drawImage(mountain, 0, 0);
            // ctx.globalAlpha = 1;
        }

        // A 'public' method.
        MountTam.drawAndReturnSceneOnCanvas = function(canvasEl) {
            var ctx = canvasEl.getContext('2d');
            drawScene(canvasEl, ctx);
            return canvasEl.toDataURL();
        }

        // Used in main.js to draw mountains on labels when Render Labels is clicked, like this:
        // MountainScene.drawArtToIMGs(document.querySelectorAll('.labelArt > img'));
        MountTam.drawArtToIMGs = function(imgList) {
            // This shouldn't be necessary, but stupid Chrome messes up the 
            // resolution of the canvas when printing it directly.
            for (var i = imgList.length - 1; i >= 0; i--) {
                imgList[i].src = MountTam.drawAndReturnSceneOnCanvas(mCanvas);
            };
        }

        // holderID will be the ID assigned to the holder element.
        // Probably should make the parent element a variable instead.
        MountTam.initialize = function(holderID) {
            createMountainHolder(holderID);
        }

        // Return this library object.
        return MountTam;
    }

    // Define globally if variable name doesn't already exist.
    if (typeof(MountainScene) === 'undefined'){
        window.MountainScene = define_library();
    } else {
        console.log("MountainScene is already defined.");
    }
})(window);