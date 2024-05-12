import { THREE, type Entity } from "aframe";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

//super class for all charts
class Chart {
    name: string | undefined;
    background: number | undefined;
    backgroundTransparent: boolean = false;
    initRotation: { x: number, y: number } = { x: 0, y: 0 };
    directionalLight: { color: number, intensity: number; position: { x: number, y: number, z: number } } | undefined;
    base: {color:number,length:number,sickness:number} | undefined;
    locked: boolean = false;
    showMeasurementLines: boolean = true;
    measurementLine: { cnt: number, color: number } = { cnt: 10, color: 0x222222 };
    measurementLabel: { size: number, color: number } = { size: 10, color: 0x000000 };
    createBase(graphWidth: number, graphLength: number, baseEdge: number, baseThickness: number, baseColor: number):THREE.Mesh {
        var baseWidth = graphWidth+(baseEdge*2),
            baseLength = graphLength+(baseEdge*2);

        var baseGeometry = new THREE.BoxGeometry(baseWidth, baseThickness, baseLength),
            baseMaterial = new THREE.MeshLambertMaterial({
                color: baseColor, 
                side: THREE.DoubleSide
            });

        var baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
        baseMesh.position.x = (baseWidth/2);
        baseMesh.position.y -= ((baseThickness/2)+0.1);
        baseMesh.position.z = (baseLength/2);

        return baseMesh
    };

    createMeasurementsLines(graphWidth, graphLength, graphHeight, numberOfMeasurementLines, lineColor, labelSize, labelColor, minValue, maxValue):THREE.Object3D {
        var measurementLineObject = new THREE.Object3D();

        var stepsEachLine = Math.ceil(graphHeight/numberOfMeasurementLines);

        for (var i=1; i<=numberOfMeasurementLines; i++) {
            var measureLineGeometry = new THREE.BufferGeometry();
            var vertices = [(graphWidth/2)*-1, (stepsEachLine*i), ((graphLength/2),(graphWidth/2)*-1, (stepsEachLine*i), (graphLength/2)*-1),((graphWidth/2), (stepsEachLine*i), (graphLength/2)*-1)];
            measureLineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            // measureLineGeometry.vertices.push(new THREE.Vector3((graphWidth/2)*-1, (stepsEachLine*i), (graphLength/2)));
            // measureLineGeometry.vertices.push(new THREE.Vector3((graphWidth/2)*-1, (stepsEachLine*i), (graphLength/2)*-1));
            // measureLineGeometry.vertices.push(new THREE.Vector3((graphWidth/2), (stepsEachLine*i), (graphLength/2)*-1));

            var measureLine = new THREE.Line(measureLineGeometry, new THREE.LineBasicMaterial({
                color: lineColor,
                side: THREE.DoubleSide
            }));

            measurementLineObject.add(measureLine);

            var textGeometry = new TextGeometry((minValue+Math.round((maxValue-minValue)/numberOfMeasurementLines)*i).toString(), {
                font: _font,
                size: labelSize,
                height: .2
            });
            
            var textMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({
                color: labelColor
            }));

            var textBoxArea = new THREE.Box3().setFromObject(textMesh);

            textMesh.position.x += ((graphWidth/2)+5);
            let size = new THREE.Vector3()
            textBoxArea.getSize(size)
            textMesh.position.y += ((stepsEachLine*i)-(size.y/2));
            textMesh.position.z -= (graphLength/2);

            measurementLineObject.add(textMesh);
        }

        measurementLineObject.position.x = (graphWidth/2);
        measurementLineObject.position.z = (graphLength/2);

        return measurementLineObject;
    };

    // Figures out the closet 10, 100, 100 etc the distance between the min and max meets
    getRoundingInteger(min: number, max: number):number {
        var diff = max-min;
        if (diff === 0) return 1;
        else {
            var multiplier = 0;
            while (true) {
                if ((diff >= Math.pow(10, multiplier)) && (diff < Math.pow(10, multiplier+1))) return Math.pow(10, (multiplier));
                multiplier++;
            }
        }
    };
}
// Calling will create a standard bar chart
BarChart = function (container: Entity, graphData) {
    // -----------------------------------------------
    // Bar chart object definitions
    // -----------------------------------------------

    // ***** Code for building and manipulating the rows *****
    var Row = function (row, dataRow, columnSpace, width) {
        this._id = dataRow.id.toString();
        this._row = row;

        this._bars = [];

        this._barWidth = width;

        this._columnSpace = columnSpace;

        this._barLabels = dataRow.showBarLabels;
    };

    // ----- Getters

    Row.prototype.getRow = function () {
        return this._row;
    };

    Row.prototype.getMinX = function () {
        return 0;
    };

    Row.prototype.getMaxX = function () {
        return 0;
    };

    Row.prototype.getMinY = function () {
        var min = null;

        for (var i = 0; i < this._bars.length; i++) {
            var dataValue = this._bars[i].getDataValue();

            if ((min === null) || (dataValue < min)) min = dataValue;
        }

        return min;
    };

    Row.prototype.getMaxY = function () {
        var max = null;

        for (var i = 0; i < this._bars.length; i++) {
            var dataValue = this._bars[i].getDataValue();

            if ((max === null) || (dataValue > max)) max = dataValue;
        }

        return max;
    };

    Row.prototype.getMinZ = function () {
        return 0;
    };

    Row.prototype.getMaxZ = function () {
        return 0;
    };

    Row.prototype.getWidth = function () {
        var totalWidth = 0;

        for (var i = 0; i < this._bars.length; i++) {
            totalWidth += this._barWidth;

            if (i != (this._bars.length - 1)) totalWidth += this._columnSpace;
        }

        return totalWidth;
    };

    Row.prototype.getLength = function () {
        var maxLength = 0;

        for (var i = 0; i < this._bars.length; i++) {
            var barWidth = this._barWidth;

            if (barWidth > maxLength) maxLength = barWidth;
        }

        return maxLength;
    };

    Row.prototype.getHeight = function () {
        var maxHeight = 0;

        for (var i = 0; i < this._bars.length; i++) {
            var height = this._bars[i].getHeight();

            if (height > maxHeight) maxHeight = height;
        }

        return maxHeight;
    };

    // ----- Public Methods

    Row.prototype.addBar = function (bar) {
        this._bars.push(bar);
    }

    Row.prototype.draw = function (graphMinX, graphMinY, graphMinZ) {
        var barObjects = new THREE.Object3D();

        for (var i = 0; i < this._bars.length; i++) {
            barObjects.add(this._bars[i].draw(graphMinY, this._barWidth));
        }

        return barObjects;
    };

    // ***** Code for building and manipulating the bars *****

    var Bar = function (column, barWidth, dataValue, color, showLabels, labelSize, labelColor) {
        var that = this;

        // ----- Private Methods

        this.getBarVertices = function (xPos, zPos, height, width) {
            var vertices = [];

            vertices.push(new THREE.Vector3(xPos - (width / 2), 0, zPos - (width / 2)));
            vertices.push(new THREE.Vector3(xPos - (width / 2), 0, zPos + (width / 2)));

            vertices.push(new THREE.Vector3(xPos + (width / 2), 0, zPos - (width / 2)));
            vertices.push(new THREE.Vector3(xPos + (width / 2), 0, zPos + (width / 2)));

            vertices.push(new THREE.Vector3(xPos - (width / 2), height, zPos - (width / 2)));
            vertices.push(new THREE.Vector3(xPos - (width / 2), height, zPos + (width / 2)));

            vertices.push(new THREE.Vector3(xPos + (width / 2), height, zPos - (width / 2)));
            vertices.push(new THREE.Vector3(xPos + (width / 2), height, zPos + (width / 2)));

            return vertices;
        };

        this.getLineGeometry = function (type, xPos, zPos, height, width) {
            var vertices = [];

            switch (type) {
                case "front":
                    vertices.push(new THREE.Vector3(xPos - (width / 2), 0, zPos + (width / 2)));
                    vertices.push(new THREE.Vector3(xPos - (width / 2), height, zPos + (width / 2)));
                    vertices.push(new THREE.Vector3(xPos + (width / 2), height, zPos + (width / 2)));
                    vertices.push(new THREE.Vector3(xPos + (width / 2), 0, zPos + (width / 2)));
                    break;
                case "back":
                    vertices.push(new THREE.Vector3(xPos - (width / 2), 0, zPos - (width / 2)));
                    vertices.push(new THREE.Vector3(xPos - (width / 2), height, zPos - (width / 2)));
                    vertices.push(new THREE.Vector3(xPos + (width / 2), height, zPos - (width / 2)));
                    vertices.push(new THREE.Vector3(xPos + (width / 2), 0, zPos - (width / 2)));
                    break;
                case "left":
                    vertices.push(new THREE.Vector3(xPos + (width / 2), 0, zPos + (width / 2)));
                    vertices.push(new THREE.Vector3(xPos + (width / 2), height, zPos + (width / 2)));
                    vertices.push(new THREE.Vector3(xPos + (width / 2), height, zPos - (width / 2)));
                    vertices.push(new THREE.Vector3(xPos + (width / 2), 0, zPos - (width / 2)));
                    break;
                case "right":
                    vertices.push(new THREE.Vector3(xPos - (width / 2), 0, zPos + (width / 2)));
                    vertices.push(new THREE.Vector3(xPos - (width / 2), height, zPos + (width / 2)));
                    vertices.push(new THREE.Vector3(xPos - (width / 2), height, zPos - (width / 2)));
                    vertices.push(new THREE.Vector3(xPos - (width / 2), 0, zPos - (width / 2)));
                    break;
            }

            return vertices;
        };

        this.getOutlineMesh = function (type, xPos, zPos, height, width, color) {
            var outlineGeometry = new THREE.BufferGeometry();
            outlineGeometry.vertices = that.getLineGeometry(type, xPos, zPos, height, width);

            var outline = new THREE.Line(outlineGeometry, new THREE.LineBasicMaterial({
                color: color
            }));
            outline.name = type;

            return outline;
        };

        this._column = column;
        this._barWidth = barWidth;
        this._color = color;
        this._dataValue = dataValue;
        this._showLabels = showLabels;
        this._labelSize = labelSize;
        this._labelColor = labelColor;
    }

    // ----- Getters

    Bar.prototype.getDataValue = function () {
        return this._dataValue;
    };

    Bar.prototype.getHeight = function () {
        return this._height;
    };

    Bar.prototype.getBarWidth = function () {
        return this._barWidth;
    };

    Bar.prototype.getBarObject = function () {
        return this._barObject;
    }

    // ----- Public Methods

    Bar.prototype.draw = function (graphMinY, barWidth) {
        this._barObject = new THREE.Object3D();

        // Calculate the bar geometry
        var xPos = ((this._column * columnSpace) + (this._column * barWidth)) + (barWidth / 2),
            height = (this._dataValue - graphMinY);

        var barGeometry = new THREE.BufferGeometry();
        barGeometry.dynamic = true;

        // Plot the verticies
        barGeometry.vertices = this.getBarVertices(xPos, 0, height, barWidth);

        // Add the faces
        barGeometry.faces.push(new THREE.Face3(0, 1, 4));
        barGeometry.faces.push(new THREE.Face3(4, 5, 1));

        barGeometry.faces.push(new THREE.Face3(3, 2, 7));
        barGeometry.faces.push(new THREE.Face3(7, 6, 2));

        barGeometry.faces.push(new THREE.Face3(1, 3, 5));
        barGeometry.faces.push(new THREE.Face3(5, 7, 3));

        barGeometry.faces.push(new THREE.Face3(0, 2, 4));
        barGeometry.faces.push(new THREE.Face3(4, 6, 2));

        barGeometry.faces.push(new THREE.Face3(4, 5, 7));
        barGeometry.faces.push(new THREE.Face3(6, 7, 4));

        barGeometry.faces.push(new THREE.Face3(0, 1, 3));
        barGeometry.faces.push(new THREE.Face3(0, 2, 3));

        barGeometry.computeFaceNormals();

        var barMesh = new THREE.Mesh(barGeometry, new THREE.MeshLambertMaterial({
            color: this._color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: barOpacity
        }));
        barMesh.name = "bar";

        this._barObject.add(barMesh);

        var barOutline = new THREE.Object3D();
        barOutline.name = "outline";

        // Generate the outlines

        barOutline.add(this.getOutlineMesh("front", xPos, 0, height, barWidth, this._color));
        barOutline.add(this.getOutlineMesh("back", xPos, 0, height, barWidth, this._color));
        barOutline.add(this.getOutlineMesh("left", xPos, 0, height, barWidth, this._color));
        barOutline.add(this.getOutlineMesh("right", xPos, 0, height, barWidth, this._color));

        this._barObject.add(barOutline);

        if (this._showLabels) {
            var valueGeometry = new TextGeometry(this._dataValue, {
                font: _font,
                size: this._labelSize,
                height: .2
            });

            var valueMesh = new THREE.Mesh(valueGeometry, new THREE.MeshBasicMaterial({
                color: this._labelColor
            }));

            var valueArea = new THREE.Box3().setFromObject(valueMesh);
            var size = new THREE.Vector3()
            valueArea.getSize(size)
            valueMesh.position.x = xPos - (size.x / 2);
            valueMesh.position.y = this._height + 2;
            valueMesh.position.z = zPos;

            this._barObject.add(valueMesh);
        }

        return this._barObject;
    };

    // Set up the basic configuration for the bar
    var barWidth = 15, // the width of the bar
        barOpacity = 0.65, // how opaque the bars are
        showBarLabels = false, // global setting, should bar labels be visible
        barLabelSize = 6, // the font size for the row label
        barLabelColor = 0x000000, // the default color for the row label
        rowSpace = 30, // the space between each row
        rowLabelSize = 4, // the font size for the row label
        rowLabelColor = 0x000000, // the default color for the row label
        columnSpace = 10, // the space between each column in a row
        columnLabelSize = 4, // the font size for the col label
        columnLabelColor = 0x000000; // the default color for the col label

    // Allow the override using the graphData options if they exist
    if (graphData !== undefined) {
        if (graphData.font !== undefined) _fontLocation = graphData.font;

        if (graphData.barWidth !== undefined) barWidth = graphData.barWidth;

        if (graphData.barOpacity !== undefined) barOpacity = graphData.barOpacity;

        if (graphData.showBarLabels !== undefined) showBarLabels = graphData.showBarLabels;

        if (graphData.barLabelSize !== undefined) barLabelSize = graphData.barLabelSize;

        if (graphData.barLabelColor !== undefined) barLabelColor = new THREE.Color(graphData.barLabelColor);

        if (graphData.rowSpace !== undefined) rowSpace = graphData.rowSpace;

        if (graphData.rowLabels !== undefined) {
            if (graphData.rowLabels.size !== undefined) rowLabelSize = graphData.rowLabels.size;

            if (graphData.rowLabels.color !== undefined) rowLabelColor = new THREE.Color(graphData.rowLabels.color);
        }

        if (graphData.columnSpace !== undefined) columnSpace = graphData.columnSpace;

        if (graphData.columnLabels !== undefined) {
            if (graphData.columnLabels.size !== undefined) columnLabelSize = graphData.columnLabels.size;

            if (graphData.columnLabels.color !== undefined) columnLabelColor = new THREE.Color(graphData.columnLabels.color);
        }
    }

    // Load the font first, we need it
    loadFont(function () {
        var containerElement = document.getElementById(container),
            containerWidth = parseInt(containerElement.style.width, 10),
            containerHeight = parseInt(containerElement.style.height, 10);

        var rowCollection = new RowCollection(rowSpace);

        // check that we've have some data passed in
        if (graphData) {
            for (var i = 0; i < graphData.data.length; i++) {
                if (graphData.data[i].id == undefined) graphData.data[i].id = i.toString();

                if (graphData.data[i].color !== undefined) graphData.data[i].color = new THREE.Color(graphData.data[i].color);
                else graphData.data[i].color = new THREE.Color("#" + Math.floor(Math.random() * 16777215).toString(16));

                // Local bar settings for labels overwrite global one
                if (graphData.data[i].showBarLabels == undefined) graphData.data[i].showBarLabels = showBarLabels;

                var row = new Row(i, graphData.data[i], columnSpace, barWidth);

                for (var j = 0; j < graphData.data[i].values.length; j++) {
                    var bar = new Bar(j, barWidth, graphData.data[i].values[j], graphData.data[i].color, graphData.data[i].showBarLabels, barLabelSize, barLabelColor);

                    row.addBar(bar);
                }

                rowCollection.addRow(row);

                if (graphData.data[i].title) {
                    var rowLabel = new RowLabel(i, rowSpace, barWidth, rowLabelSize, rowLabelColor, graphData.data[i].title);

                    rowCollection.addRowLabel(rowLabel);
                }
            }

            for (var i = 0; i < graphData.columnLabels.values.length; i++) {
                var columnLabel = new ColumnLabel(i, columnSpace, barWidth, columnLabelSize, columnLabelColor, graphData.columnLabels.values[i]);

                rowCollection.addColumnLabel(columnLabel);
            }
        }

        // Give it a name just for simplicity
        var graphName = "barGraph";
        if ((graphData) && (graphData.name)) graphName = graphData.name;

        // The graph we will be building
        var graph = new Graph(containerElement, graphName, graphData, rowCollection);

        return graph;
    });
}