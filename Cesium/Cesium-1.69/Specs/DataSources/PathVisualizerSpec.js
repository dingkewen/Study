import { Cartesian3 } from "../../Source/Cesium.js";
import { Color } from "../../Source/Cesium.js";
import { DistanceDisplayCondition } from "../../Source/Cesium.js";
import { JulianDate } from "../../Source/Cesium.js";
import { Matrix4 } from "../../Source/Cesium.js";
import { ReferenceFrame } from "../../Source/Cesium.js";
import { TimeInterval } from "../../Source/Cesium.js";
import { CompositePositionProperty } from "../../Source/Cesium.js";
import { ConstantPositionProperty } from "../../Source/Cesium.js";
import { ConstantProperty } from "../../Source/Cesium.js";
import { EntityCollection } from "../../Source/Cesium.js";
import { PathGraphics } from "../../Source/Cesium.js";
import { PathVisualizer } from "../../Source/Cesium.js";
import { PolylineGlowMaterialProperty } from "../../Source/Cesium.js";
import { PolylineOutlineMaterialProperty } from "../../Source/Cesium.js";
import { ReferenceProperty } from "../../Source/Cesium.js";
import { SampledPositionProperty } from "../../Source/Cesium.js";
import { ScaledPositionProperty } from "../../Source/Cesium.js";
import { TimeIntervalCollectionPositionProperty } from "../../Source/Cesium.js";
import { SceneMode } from "../../Source/Cesium.js";
import createScene from "../createScene.js";

describe(
  "DataSources/PathVisualizer",
  function () {
    var scene;
    var visualizer;

    beforeAll(function () {
      scene = createScene();
    });

    afterAll(function () {
      scene.destroyForSpecs();
    });

    afterEach(function () {
      visualizer = visualizer && visualizer.destroy();
    });

    it("constructor throws if no scene is passed.", function () {
      expect(function () {
        return new PathVisualizer();
      }).toThrowDeveloperError();
    });

    it("update throws if no time specified.", function () {
      var entityCollection = new EntityCollection();
      visualizer = new PathVisualizer(scene, entityCollection);
      expect(function () {
        visualizer.update();
      }).toThrowDeveloperError();
    });

    it("isDestroy returns false until destroyed.", function () {
      var entityCollection = new EntityCollection();
      visualizer = new PathVisualizer(scene, entityCollection);
      expect(visualizer.isDestroyed()).toEqual(false);
      visualizer.destroy();
      expect(visualizer.isDestroyed()).toEqual(true);
      visualizer = undefined;
    });

    it("removes the listener from the entity collection when destroyed", function () {
      var entityCollection = new EntityCollection();
      var visualizer = new PathVisualizer(scene, entityCollection);
      expect(entityCollection.collectionChanged.numberOfListeners).toEqual(1);
      visualizer.destroy();
      expect(entityCollection.collectionChanged.numberOfListeners).toEqual(0);
    });

    it("object with no path does not create one.", function () {
      var entityCollection = new EntityCollection();
      visualizer = new PathVisualizer(scene, entityCollection);

      var testObject = entityCollection.getOrCreateEntity("test");
      testObject.position = new ConstantProperty([
        new Cartesian3(1234, 5678, 9101112),
        new Cartesian3(5678, 1234, 1101112),
      ]);
      visualizer.update(JulianDate.now());
      expect(scene.primitives.length).toEqual(0);
    });

    it("object with no position does not create a polyline.", function () {
      var entityCollection = new EntityCollection();
      visualizer = new PathVisualizer(scene, entityCollection);

      var testObject = entityCollection.getOrCreateEntity("test");
      var path = (testObject.path = new PathGraphics());
      path.show = new ConstantProperty(true);

      visualizer.update(JulianDate.now());
      expect(scene.primitives.length).toEqual(0);
    });

    it("adding and removing an entity path without rendering does not crash.", function () {
      var times = [new JulianDate(0, 0), new JulianDate(1, 0)];
      var positions = [
        new Cartesian3(1234, 5678, 9101112),
        new Cartesian3(5678, 1234, 1101112),
      ];

      var entityCollection = new EntityCollection();
      visualizer = new PathVisualizer(scene, entityCollection);

      var position = new SampledPositionProperty();
      position.addSamples(times, positions);

      var testObject = entityCollection.getOrCreateEntity("test");
      testObject.position = position;
      testObject.path = new PathGraphics();

      //Before we fixed the issue, the below remove call would cause a crash
      //when visualizer.update was not called at least once after the entity was added.
      entityCollection.remove(testObject);
    });

    it("A PathGraphics causes a primitive to be created and updated.", function () {
      var times = [new JulianDate(0, 0), new JulianDate(1, 0)];
      var updateTime = new JulianDate(0.5, 0);
      var positions = [
        new Cartesian3(1234, 5678, 9101112),
        new Cartesian3(5678, 1234, 1101112),
      ];

      var entityCollection = new EntityCollection();
      visualizer = new PathVisualizer(scene, entityCollection);

      expect(scene.primitives.length).toEqual(0);

      var testObject = entityCollection.getOrCreateEntity("test");
      var position = new SampledPositionProperty();
      testObject.position = position;
      position.addSamples(times, positions);

      var path = (testObject.path = new PathGraphics());
      path.show = new ConstantProperty(true);
      path.material = new PolylineOutlineMaterialProperty();
      path.material.color = new ConstantProperty(new Color(0.8, 0.7, 0.6, 0.5));
      path.material.outlineColor = new ConstantProperty(
        new Color(0.1, 0.2, 0.3, 0.4)
      );
      path.material.outlineWidth = new ConstantProperty(2.5);
      path.width = new ConstantProperty(12.5);
      path.distanceDisplayCondition = new ConstantProperty(
        new DistanceDisplayCondition(10.0, 20.0)
      );
      path.leadTime = new ConstantProperty(25);
      path.trailTime = new ConstantProperty(10);

      visualizer.update(updateTime);

      expect(scene.primitives.length).toEqual(1);

      var polylineCollection = scene.primitives.get(0);
      var primitive = polylineCollection.get(0);
      expect(primitive.positions[0]).toEqual(
        testObject.position.getValue(
          JulianDate.addSeconds(
            updateTime,
            -path.trailTime.getValue(),
            new JulianDate()
          )
        )
      );
      expect(primitive.positions[1]).toEqual(
        testObject.position.getValue(updateTime)
      );
      expect(primitive.positions[2]).toEqual(
        testObject.position.getValue(
          JulianDate.addSeconds(
            updateTime,
            path.leadTime.getValue(),
            new JulianDate()
          )
        )
      );
      expect(primitive.show).toEqual(testObject.path.show.getValue(updateTime));
      expect(primitive.width).toEqual(
        testObject.path.width.getValue(updateTime)
      );
      expect(primitive.distanceDisplayCondition).toEqual(
        testObject.path.distanceDisplayCondition.getValue(updateTime)
      );

      var material = primitive.material;
      expect(material.uniforms.color).toEqual(
        testObject.path.material.color.getValue(updateTime)
      );
      expect(material.uniforms.outlineColor).toEqual(
        testObject.path.material.outlineColor.getValue(updateTime)
      );
      expect(material.uniforms.outlineWidth).toEqual(
        testObject.path.material.outlineWidth.getValue(updateTime)
      );

      path.show = new ConstantProperty(false);
      visualizer.update(updateTime);
      expect(primitive.show).toEqual(testObject.path.show.getValue(updateTime));
    });

    it("creates primitives when an entity is already in the collection.", function () {
      var times = [new JulianDate(0, 0), new JulianDate(1, 0)];
      var updateTime = new JulianDate(0.5, 0);
      var positions = [
        new Cartesian3(1234, 5678, 9101112),
        new Cartesian3(5678, 1234, 1101112),
      ];

      var entityCollection = new EntityCollection();

      var testObject = entityCollection.getOrCreateEntity("test");
      var position = new SampledPositionProperty();
      testObject.position = position;
      position.addSamples(times, positions);

      var path = (testObject.path = new PathGraphics());
      path.show = new ConstantProperty(true);
      path.material = new PolylineOutlineMaterialProperty();
      path.material.color = new ConstantProperty(new Color(0.8, 0.7, 0.6, 0.5));
      path.material.outlineColor = new ConstantProperty(
        new Color(0.1, 0.2, 0.3, 0.4)
      );
      path.material.outlineWidth = new ConstantProperty(2.5);
      path.width = new ConstantProperty(12.5);
      path.leadTime = new ConstantProperty(25);
      path.trailTime = new ConstantProperty(10);

      visualizer = new PathVisualizer(scene, entityCollection);

      expect(scene.primitives.length).toEqual(0);

      visualizer.update(updateTime);

      expect(scene.primitives.length).toEqual(1);
    });

    it("A custom material can be used.", function () {
      var times = [new JulianDate(0, 0), new JulianDate(1, 0)];
      var updateTime = new JulianDate(0.5, 0);
      var positions = [
        new Cartesian3(1234, 5678, 9101112),
        new Cartesian3(5678, 1234, 1101112),
      ];

      var entityCollection = new EntityCollection();
      visualizer = new PathVisualizer(scene, entityCollection);

      expect(scene.primitives.length).toEqual(0);

      var testObject = entityCollection.getOrCreateEntity("test");
      var position = new SampledPositionProperty();
      testObject.position = position;
      position.addSamples(times, positions);

      var path = (testObject.path = new PathGraphics());
      path.show = new ConstantProperty(true);
      path.material = new PolylineGlowMaterialProperty();
      path.material.color = new ConstantProperty(new Color(0.8, 0.7, 0.6, 0.5));
      path.material.glowPower = new ConstantProperty(0.2);
      path.material.taperPower = new ConstantProperty(0.15);
      path.width = new ConstantProperty(12.5);
      path.leadTime = new ConstantProperty(25);
      path.trailTime = new ConstantProperty(10);

      visualizer.update(updateTime);

      expect(scene.primitives.length).toEqual(1);

      var polylineCollection = scene.primitives.get(0);
      var primitive = polylineCollection.get(0);

      var material = primitive.material;
      expect(material.uniforms.color).toEqual(
        testObject.path.material.color.getValue(updateTime)
      );
      expect(material.uniforms.glowPower).toEqual(
        testObject.path.material.glowPower.getValue(updateTime)
      );
      expect(material.uniforms.taperPower).toEqual(
        testObject.path.material.taperPower.getValue(updateTime)
      );
    });

    it("Reuses primitives when hiding one and showing another", function () {
      var times = [new JulianDate(0, 0), new JulianDate(1, 0)];
      var time = new JulianDate(0.5, 0);
      var positions = [
        new Cartesian3(1234, 5678, 9101112),
        new Cartesian3(5678, 1234, 1101112),
      ];

      var entityCollection = new EntityCollection();
      visualizer = new PathVisualizer(scene, entityCollection);

      var position = new SampledPositionProperty();
      position.addSamples(times, positions);

      var testObject = entityCollection.getOrCreateEntity("test");
      testObject.position = position;
      testObject.path = new PathGraphics();
      testObject.path.show = new ConstantProperty(true);
      testObject.path.leadTime = new ConstantProperty(25);
      testObject.path.trailTime = new ConstantProperty(10);

      visualizer.update(time);

      var polylineCollection = scene.primitives.get(0);
      expect(polylineCollection.length).toEqual(1);

      testObject.path.show = new ConstantProperty(false);

      visualizer.update(time);

      expect(polylineCollection.length).toEqual(1);

      position = new SampledPositionProperty();
      position.addSamples(times, positions);

      var testObject2 = entityCollection.getOrCreateEntity("test2");
      testObject2.position = position;
      testObject2.path = new PathGraphics();
      testObject2.path.show = new ConstantProperty(true);
      testObject2.path.leadTime = new ConstantProperty(25);
      testObject2.path.trailTime = new ConstantProperty(10);

      visualizer.update(time);
      expect(polylineCollection.length).toEqual(1);
    });

    it("Switches from inertial to fixed paths in 2D", function () {
      var times = [new JulianDate(0, 0), new JulianDate(1, 0)];
      var time = new JulianDate(0.5, 0);
      var positions = [
        new Cartesian3(1234, 5678, 9101112),
        new Cartesian3(5678, 1234, 1101112),
      ];

      var position = new SampledPositionProperty(ReferenceFrame.INERTIAL);
      position.addSamples(times, positions);

      var entityCollection = new EntityCollection();
      visualizer = new PathVisualizer(scene, entityCollection);
      var testObject = entityCollection.getOrCreateEntity("test");
      testObject.position = position;
      testObject.path = new PathGraphics();
      testObject.path.leadTime = new ConstantProperty(25);
      testObject.path.trailTime = new ConstantProperty(10);

      visualizer.update(time);

      expect(scene.primitives.length).toEqual(1);

      //They'll be one inertial polyline collection
      var inertialPolylineCollection = scene.primitives.get(0);
      expect(inertialPolylineCollection.length).toEqual(1);
      expect(inertialPolylineCollection.modelMatrix).not.toEqual(
        Matrix4.IDENTITY
      );

      var inertialLine = inertialPolylineCollection.get(0);
      expect(inertialLine.show).toEqual(true);

      scene.mode = SceneMode.SCENE2D;
      visualizer.update(time);

      //They'll be one inertial polyline collection (with no visible lines)
      //and a new fixed polyline collection.
      expect(scene.primitives.length).toEqual(2);

      var fixedPolylineCollection = scene.primitives.get(1);

      expect(inertialLine.show).toEqual(false);
      expect(fixedPolylineCollection.length).toEqual(1);
      expect(fixedPolylineCollection.modelMatrix).toEqual(Matrix4.IDENTITY);

      var fixedLine = fixedPolylineCollection.get(0);
      expect(fixedLine.show).toEqual(true);
    });

    it("clear hides primitives.", function () {
      var times = [new JulianDate(0, 0), new JulianDate(1, 0)];
      var updateTime = new JulianDate(0.5, 0);
      var positions = [
        new Cartesian3(1234, 5678, 9101112),
        new Cartesian3(5678, 1234, 1101112),
      ];

      var entityCollection = new EntityCollection();
      visualizer = new PathVisualizer(scene, entityCollection);

      expect(scene.primitives.length).toEqual(0);

      var testObject = entityCollection.getOrCreateEntity("test");
      var position = new SampledPositionProperty();
      testObject.position = position;
      position.addSamples(times, positions);

      var path = (testObject.path = new PathGraphics());
      path.show = new ConstantProperty(true);
      path.color = new ConstantProperty(new Color(0.8, 0.7, 0.6, 0.5));
      path.width = new ConstantProperty(12.5);
      path.outlineColor = new ConstantProperty(new Color(0.1, 0.2, 0.3, 0.4));
      path.outlineWidth = new ConstantProperty(2.5);
      path.leadTime = new ConstantProperty(25);
      path.trailTime = new ConstantProperty(10);

      visualizer.update(updateTime);

      expect(scene.primitives.length).toEqual(1);

      var polylineCollection = scene.primitives.get(0);
      var primitive = polylineCollection.get(0);

      visualizer.update(updateTime);
      //Clearing won't actually remove the primitive because of the
      //internal cache used by the visualizer, instead it just hides it.
      entityCollection.removeAll();
      expect(primitive.show).toEqual(false);
      expect(primitive.id).toBeUndefined();
    });

    it("Visualizer sets entity property.", function () {
      var times = [new JulianDate(0, 0), new JulianDate(1, 0)];
      var updateTime = new JulianDate(0.5, 0);
      var positions = [
        new Cartesian3(1234, 5678, 9101112),
        new Cartesian3(5678, 1234, 1101112),
      ];

      var entityCollection = new EntityCollection();
      visualizer = new PathVisualizer(scene, entityCollection);

      expect(scene.primitives.length).toEqual(0);

      var testObject = entityCollection.getOrCreateEntity("test");
      var position = new SampledPositionProperty();
      testObject.position = position;
      position.addSamples(times, positions);

      var path = (testObject.path = new PathGraphics());
      path.show = new ConstantProperty(true);
      path.color = new ConstantProperty(new Color(0.8, 0.7, 0.6, 0.5));
      path.width = new ConstantProperty(12.5);
      path.outlineColor = new ConstantProperty(new Color(0.1, 0.2, 0.3, 0.4));
      path.outlineWidth = new ConstantProperty(2.5);
      path.leadTime = new ConstantProperty(25);
      path.trailTime = new ConstantProperty(10);

      visualizer.update(updateTime);
      var polylineCollection = scene.primitives.get(0);
      var primitive = polylineCollection.get(0);
      expect(primitive.id).toEqual(testObject);
    });

    it("Visualizer destroys primitives when all items are removed.", function () {
      var times = [new JulianDate(0, 0), new JulianDate(1, 0)];
      var updateTime = new JulianDate(0.5, 0);
      var positions = [
        new Cartesian3(1234, 5678, 9101112),
        new Cartesian3(5678, 1234, 1101112),
      ];

      var entityCollection = new EntityCollection();
      visualizer = new PathVisualizer(scene, entityCollection);

      expect(scene.primitives.length).toEqual(0);

      var testObject = entityCollection.getOrCreateEntity("test");
      var position = new SampledPositionProperty();
      testObject.position = position;
      position.addSamples(times, positions);

      var path = (testObject.path = new PathGraphics());
      path.show = new ConstantProperty(true);
      path.color = new ConstantProperty(new Color(0.8, 0.7, 0.6, 0.5));
      path.width = new ConstantProperty(12.5);
      path.outlineColor = new ConstantProperty(new Color(0.1, 0.2, 0.3, 0.4));
      path.outlineWidth = new ConstantProperty(2.5);
      path.leadTime = new ConstantProperty(25);
      path.trailTime = new ConstantProperty(10);

      visualizer.update(updateTime);

      expect(scene.primitives.length).toEqual(1);

      entityCollection.removeAll();
      visualizer.update(updateTime);

      expect(scene.primitives.length).toEqual(0);
    });

    it("subSample works for constant properties", function () {
      var property = new ConstantPositionProperty(
        new Cartesian3(1000, 2000, 3000)
      );
      var start = new JulianDate(0, 0);
      var stop = new JulianDate(1, 0);
      var updateTime = new JulianDate(1, 43200);
      var referenceFrame = ReferenceFrame.FIXED;
      var maximumStep = 10;
      var result = PathVisualizer._subSample(
        property,
        start,
        stop,
        updateTime,
        referenceFrame,
        maximumStep
      );
      expect(result).toEqual([property._value]);
    });

    it("subSample works for reference properties", function () {
      var property = new ConstantPositionProperty(
        new Cartesian3(1000, 2000, 3000)
      );
      var start = new JulianDate(0, 0);
      var stop = new JulianDate(1, 0);
      var updateTime = new JulianDate(1, 43200);
      var referenceFrame = ReferenceFrame.FIXED;
      var maximumStep = 10;

      var entities = new EntityCollection();
      var targetEntity = entities.getOrCreateEntity("target");
      targetEntity.position = property;

      var referenceProperty = new ReferenceProperty(entities, "target", [
        "position",
      ]);

      var result = PathVisualizer._subSample(
        referenceProperty,
        start,
        stop,
        updateTime,
        referenceFrame,
        maximumStep
      );
      expect(result).toEqual([property._value]);
    });

    it("subSample works for sampled properties", function () {
      var property = new SampledPositionProperty();

      var start = new JulianDate(0, 0);
      var stop = new JulianDate(1, 0);

      property.addSample(start, new Cartesian3(0, 0, 0));
      property.addSample(stop, new Cartesian3(0, 0, 100));

      var updateTime = new JulianDate(0, 43200);
      var referenceFrame = ReferenceFrame.FIXED;
      var maximumStep = 86400;
      var result = [];

      //A large maximum step causes no sub-smapling.
      PathVisualizer._subSample(
        property,
        start,
        stop,
        updateTime,
        referenceFrame,
        maximumStep,
        result
      );
      expect(result).toEqual([
        property.getValue(start),
        property.getValue(updateTime),
        property.getValue(stop),
      ]);

      //An evenly spaced maximum step causes equal steps from start to stop
      maximumStep = 28800;
      var expectedStep = 28800;
      PathVisualizer._subSample(
        property,
        start,
        stop,
        updateTime,
        referenceFrame,
        maximumStep,
        result
      );
      expect(result).toEqual([
        property.getValue(start),
        property.getValue(
          JulianDate.addSeconds(start, expectedStep, new JulianDate())
        ),
        property.getValue(updateTime),
        property.getValue(
          JulianDate.addSeconds(start, expectedStep * 2, new JulianDate())
        ),
        property.getValue(stop),
      ]);

      //An maximum step size that is slightly more than halfway between points causes a single step halfway between points
      maximumStep = 43201;
      expectedStep = 43200;
      updateTime = new JulianDate(0, 64800);
      PathVisualizer._subSample(
        property,
        start,
        stop,
        updateTime,
        referenceFrame,
        maximumStep,
        result
      );
      expect(result).toEqual([
        property.getValue(start),
        property.getValue(
          JulianDate.addSeconds(start, expectedStep, new JulianDate())
        ),
        property.getValue(updateTime),
        property.getValue(stop),
      ]);

      //An maximum step size that is slightly less than halfway between points causes two steps of the eqaul size to be taken between points
      maximumStep = 43199;
      expectedStep = 28800;
      updateTime = new JulianDate(0, 21600);
      PathVisualizer._subSample(
        property,
        start,
        stop,
        updateTime,
        referenceFrame,
        maximumStep,
        result
      );
      expect(result).toEqual([
        property.getValue(start),
        property.getValue(updateTime),
        property.getValue(
          JulianDate.addSeconds(start, expectedStep, new JulianDate())
        ),
        property.getValue(
          JulianDate.addSeconds(start, expectedStep * 2, new JulianDate())
        ),
        property.getValue(stop),
      ]);
    });

    it("subSample works for interval properties", function () {
      var t1 = new JulianDate(0, 0);
      var t2 = new JulianDate(1, 0);
      var t3 = new JulianDate(2, 0);
      var t4 = new JulianDate(3, 0);

      var property = new TimeIntervalCollectionPositionProperty();
      property.intervals.addInterval(
        new TimeInterval({
          start: t1,
          stop: t2,
          data: new Cartesian3(0, 0, 1),
        })
      );
      property.intervals.addInterval(
        new TimeInterval({
          start: t2,
          stop: t3,
          isStartIncluded: false,
          isStopIncluded: false,
          data: new Cartesian3(0, 0, 2),
        })
      );
      property.intervals.addInterval(
        new TimeInterval({
          start: t3,
          stop: t4,
          data: new Cartesian3(0, 0, 3),
        })
      );

      var updateTime = new JulianDate(1, 43200);
      var referenceFrame = ReferenceFrame.FIXED;
      var maximumStep = 10;
      var result = [];
      PathVisualizer._subSample(
        property,
        t1,
        t4,
        updateTime,
        referenceFrame,
        maximumStep,
        result
      );
      expect(result).toEqual([
        new Cartesian3(0, 0, 1),
        new Cartesian3(0, 0, 2),
        new Cartesian3(0, 0, 3),
      ]);

      PathVisualizer._subSample(
        property,
        t2,
        t3,
        updateTime,
        referenceFrame,
        maximumStep,
        result
      );
      expect(result).toEqual([
        new Cartesian3(0, 0, 1),
        new Cartesian3(0, 0, 2),
        new Cartesian3(0, 0, 3),
      ]);

      PathVisualizer._subSample(
        property,
        t1,
        t2,
        updateTime,
        referenceFrame,
        maximumStep,
        result
      );
      expect(result).toEqual([new Cartesian3(0, 0, 1)]);

      PathVisualizer._subSample(
        property,
        t3,
        t4,
        updateTime,
        referenceFrame,
        maximumStep,
        result
      );
      expect(result).toEqual([new Cartesian3(0, 0, 3)]);
    });

    function CustomPositionProperty(innerProperty) {
      this.SampledProperty = innerProperty;
      this.isConstant = innerProperty.isConstant;
      this.definitionChanged = innerProperty.definitionChanged;
      this.referenceFrame = innerProperty.referenceFrame;

      this.getValue = function (time, result) {
        return innerProperty.getValue(time, result);
      };

      this.getValueInReferenceFrame = function (time, referenceFrame, result) {
        return innerProperty.getValueInReferenceFrame(
          time,
          referenceFrame,
          result
        );
      };

      this.equals = function (other) {
        return innerProperty.equals(other);
      };
    }

    it("subSample works for custom properties", function () {
      var t1 = new JulianDate(0, 0);
      var t2 = new JulianDate(1, 0);
      var t3 = new JulianDate(2, 0);
      var t4 = new JulianDate(3, 0);
      var updateTime = new JulianDate(1, 1);

      var sampledProperty = new SampledPositionProperty();
      sampledProperty.addSample(t1, new Cartesian3(0, 0, 1));
      sampledProperty.addSample(t2, new Cartesian3(0, 0, 2));
      sampledProperty.addSample(t3, new Cartesian3(0, 0, 3));
      sampledProperty.addSample(t4, new Cartesian3(0, 0, 4));

      var property = new CustomPositionProperty(sampledProperty);

      var referenceFrame = ReferenceFrame.FIXED;
      var maximumStep = 43200;
      var result = [];
      PathVisualizer._subSample(
        property,
        t1,
        t4,
        updateTime,
        referenceFrame,
        maximumStep,
        result
      );
      expect(result).toEqual([
        sampledProperty.getValue(t1),
        sampledProperty.getValue(
          JulianDate.addSeconds(t1, maximumStep, new JulianDate())
        ),
        sampledProperty.getValue(
          JulianDate.addSeconds(t1, maximumStep * 2, new JulianDate())
        ),
        sampledProperty.getValue(updateTime),
        sampledProperty.getValue(
          JulianDate.addSeconds(t1, maximumStep * 3, new JulianDate())
        ),
        sampledProperty.getValue(
          JulianDate.addSeconds(t1, maximumStep * 4, new JulianDate())
        ),
        sampledProperty.getValue(
          JulianDate.addSeconds(t1, maximumStep * 5, new JulianDate())
        ),
        sampledProperty.getValue(
          JulianDate.addSeconds(t1, maximumStep * 6, new JulianDate())
        ),
      ]);
    });

    function createCompositeTest(useReferenceProperty) {
      var t1 = new JulianDate(0, 0);
      var t2 = new JulianDate(1, 0);
      var t3 = new JulianDate(2, 0);
      var t4 = new JulianDate(3, 0);
      var t5 = new JulianDate(4, 0);
      var t6 = new JulianDate(5, 0);

      var constantProperty = new ConstantPositionProperty(
        new Cartesian3(0, 0, 1)
      );

      var intervalProperty = new TimeIntervalCollectionPositionProperty();
      intervalProperty.intervals.addInterval(
        new TimeInterval({
          start: t1,
          stop: t2,
          data: new Cartesian3(0, 0, 1),
        })
      );
      intervalProperty.intervals.addInterval(
        new TimeInterval({
          start: t2,
          stop: t3,
          isStartIncluded: false,
          isStopIncluded: false,
          data: new Cartesian3(0, 0, 2),
        })
      );
      intervalProperty.intervals.addInterval(
        new TimeInterval({
          start: t1,
          stop: t2,
          data: new Cartesian3(0, 0, 3),
        })
      );

      var sampledProperty = new SampledPositionProperty();
      sampledProperty.addSample(t1, new Cartesian3(0, 0, 1));
      sampledProperty.addSample(t2, new Cartesian3(0, 0, 2));
      sampledProperty.addSample(t3, new Cartesian3(0, 0, 3));
      sampledProperty.addSample(t4, new Cartesian3(0, 0, 4));

      var entities = new EntityCollection();
      var targetEntity = entities.getOrCreateEntity("target");
      targetEntity.position = new ConstantPositionProperty(
        new Cartesian3(0, 0, 5)
      );
      var referenceProperty = new ReferenceProperty(entities, "target", [
        "position",
      ]);

      var scaledProperty = new ScaledPositionProperty(referenceProperty);

      var property = new CompositePositionProperty();
      property.intervals.addInterval(
        new TimeInterval({
          start: t1,
          stop: t2,
          data: intervalProperty,
        })
      );
      property.intervals.addInterval(
        new TimeInterval({
          start: t2,
          stop: t3,
          isStartIncluded: false,
          isStopIncluded: false,
          data: constantProperty,
        })
      );
      property.intervals.addInterval(
        new TimeInterval({
          start: t3,
          stop: t4,
          data: sampledProperty,
        })
      );
      property.intervals.addInterval(
        new TimeInterval({
          start: t4,
          stop: t5,
          isStartIncluded: false,
          isStopIncluded: true,
          data: referenceProperty,
        })
      );
      property.intervals.addInterval(
        new TimeInterval({
          start: t5,
          stop: t6,
          isStartIncluded: false,
          isStopIncluded: true,
          data: scaledProperty,
        })
      );

      var updateTime = new JulianDate(0, 0);
      var referenceFrame = ReferenceFrame.FIXED;
      var maximumStep = 43200;
      var result = [];

      var propertyToTest = property;
      if (useReferenceProperty) {
        var testReference = entities.getOrCreateEntity("testReference");
        testReference.position = property;
        propertyToTest = new ReferenceProperty(entities, "testReference", [
          "position",
        ]);
      }

      PathVisualizer._subSample(
        propertyToTest,
        t1,
        t6,
        updateTime,
        referenceFrame,
        maximumStep,
        result
      );
      expect(result).toEqual([
        intervalProperty.intervals.get(0).data,
        constantProperty.getValue(t1),
        sampledProperty.getValue(t3),
        sampledProperty.getValue(
          JulianDate.addSeconds(t3, maximumStep, new JulianDate())
        ),
        sampledProperty.getValue(t4),
        targetEntity.position.getValue(t5),
        scaledProperty.getValue(t6),
      ]);
    }

    it("subSample works for composite properties", function () {
      createCompositeTest(false);
    });

    it("subSample works for composite properties wrapped in reference properties", function () {
      createCompositeTest(true);
    });
  },
  "WebGL"
);
