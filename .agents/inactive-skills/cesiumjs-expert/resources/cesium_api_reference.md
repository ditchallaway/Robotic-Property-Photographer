# CesiumJS API Reference

Generated from local documentation.

# Viewer
### new Cesium.Viewer(container,options)
> A base widget for building applications.  It composites all of the standard Cesium widgets into one reusable package.
The widget can always be extended by using mixins, which add functionality useful for a variety of applications. 

| Name | Type | Description |
| --- | --- | --- |
 |
| container| Element\|string| The DOM element or ID that will contain the widget. |
| options| Viewer.ConstructorOptions| optionalObject describing initialization options |

## Members
### allowDataSourcesToSuspendAnimation: boolean
> Gets or sets whether or not data sources can temporarily pause
animation in order to avoid showing an incomplete picture to the user.
For example, if asynchronous primitives are being processed in the
background, the clock will not advance until the geometry is ready. 

### readonlyanimation:Animation
> Gets the Animation widget. 

### readonlybaseLayerPicker:BaseLayerPicker
> Gets the BaseLayerPicker. 

### readonlybottomContainer: Element
> Gets the DOM element for the area at the bottom of the window containing the CreditDisplay and potentially other things. 

### readonlycamera:Camera
> Gets the camera. 

### readonlycanvas: HTMLCanvasElement
> Gets the canvas. 

### readonlycesiumWidget:CesiumWidget
> Gets the CesiumWidget. 

### readonlyclock:Clock
> Gets the clock. 

### clockTrackedDataSource:DataSource
> Gets or sets the data source to track with the viewer's clock. 

### readonlyclockViewModel:ClockViewModel
> Gets the clock view model. 

### readonlycontainer: Element
> Gets the parent container. 

### creditDisplay:CreditDisplay
> Manages the list of credits to display on screen and in the lightbox. 

### readonlydataSourceDisplay:DataSourceDisplay
> Gets the display used for DataSource visualization. 

### readonlydataSources:DataSourceCollection
> Gets the set of DataSource instances to be visualized. 

### readonlyellipsoid:Ellipsoid
> Gets the default ellipsoid for the scene. 

### readonlyentities:EntityCollection
> Gets the collection of entities not tied to a particular data source.
This is a shortcut to dataSourceDisplay.defaultDataSource.entities . 

### readonlyfullscreenButton:FullscreenButton
> Gets the FullscreenButton. 

### readonlygeocoder:Geocoder
> Gets the Geocoder. 

### readonlyhomeButton:HomeButton
> Gets the HomeButton. 

### readonlyimageryLayers:ImageryLayerCollection
> Gets the collection of image layers that will be rendered on the globe. 

### readonlyinfoBox:InfoBox
> Gets the info box. 

### readonlynavigationHelpButton:NavigationHelpButton
> Gets the NavigationHelpButton. 

### readonlypostProcessStages:PostProcessStageCollection
> Gets the post-process stages. 

### readonlyprojectionPicker:ProjectionPicker
> Gets the ProjectionPicker. 

### resolutionScale: number
> Gets or sets a scaling factor for rendering resolution.  Values less than 1.0 can improve
performance on less powerful devices while values greater than 1.0 will render at a higher
resolution and then scale down, resulting in improved visual fidelity.
For example, if the widget is laid out at a size of 640x480, setting this value to 0.5
will cause the scene to be rendered at 320x240 and then scaled up while setting
it to 2.0 will cause the scene to be rendered at 1280x960 and then scaled down. 

### readonlyscene:Scene
> Gets the scene. 

### readonlysceneModePicker:SceneModePicker
> Gets the SceneModePicker. 

### readonlyscreenSpaceEventHandler:ScreenSpaceEventHandler
> Gets the screen space event handler. 

### selectedEntity:Entity|undefined
> Gets or sets the object instance for which to display a selection indicator.

If a user interactively picks a Cesium3DTilesFeature instance, then this property
will contain a transient Entity instance with a property named "feature" that is
the instance that was picked. 

### readonlyselectedEntityChanged:Event
> Gets the event that is raised when the selected entity changes. 

### readonlyselectionIndicator:SelectionIndicator
> Gets the selection indicator. 

### readonlyshadowMap:ShadowMap
> Get the scene's shadow map 

### shadows: boolean
> Determines if shadows are cast by light sources. 

### targetFrameRate: number
> Gets or sets the target frame rate of the widget when useDefaultRenderLoop is true. If undefined, the browser's requestAnimationFrame implementation
determines the frame rate.  If defined, this value must be greater than 0.  A value higher
than the underlying requestAnimationFrame implementation will have no effect. 

### terrainProvider:TerrainProvider
> The terrain provider providing surface geometry for the globe. 

### terrainShadows:ShadowMode
> Determines if the terrain casts or shadows from light sources. 

### readonlytimeline:Timeline
> Gets the Timeline widget. 

### trackedEntity:Entity|undefined
> Gets or sets the Entity instance currently being tracked by the camera. 

### readonlytrackedEntityChanged:Event
> Gets the event that is raised when the tracked entity changes. 

### useBrowserRecommendedResolution: boolean
> Boolean flag indicating if the browser's recommended resolution is used.
If true, the browser's device pixel ratio is ignored and 1.0 is used instead,
effectively rendering based on CSS pixels instead of device pixels. This can improve
performance on less powerful devices that have high pixel density. When false, rendering
will be in device pixels. Viewer#resolutionScale will still take effect whether
this flag is true or false. 

### useDefaultRenderLoop: boolean
> Gets or sets whether or not this widget should control the render loop.
If true the widget will use requestAnimationFrame to
perform rendering and resizing of the widget, as well as drive the
simulation clock. If set to false, you must manually call the resize , render methods
as part of a custom render loop.  If an error occurs during rendering, Scene 's renderError event will be raised and this property
will be set to false.  It must be set back to true to continue rendering
after the error. 

### readonlyvrButton:VRButton
> Gets the VRButton. 

## Methods
### destroy()
> Destroys the widget.  Should be called if permanently
removing the widget from layout. 

### extend(mixin,options)
> Extends the base viewer functionality with the provided mixin.
A mixin may add additional properties, functions, or other behavior
to the provided viewer instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| mixin| Viewer.ViewerMixin| The Viewer mixin to add to this instance. |
| options| object| optionalThe options object to be passed to the mixin function. |

### flyTo(target,options)→Promise.<boolean>
> Flies the camera to the provided entity, entities, or data source.
If the data source is still in the process of loading or the visualization is otherwise still loading,
this method waits for the data to be ready before performing the flight. The offset is heading/pitch/range in the local east-north-up reference frame centered at the center of the bounding sphere.
The heading and the pitch angles are defined in the local east-north-up reference frame.
The heading is the angle from y axis and increasing towards the x axis. Pitch is the rotation from the xy-plane. Positive pitch
angles are above the plane. Negative pitch angles are below the plane. The range is the distance from the center. If the range is
zero, a range will be computed such that the whole bounding sphere is visible. In 2D, there must be a top down view. The camera will be placed above the target looking down. The height above the
target will be the range. The heading will be determined from the offset. If the heading cannot be
determined from the offset, the heading will be north. 

| Name | Type | Description |
| --- | --- | --- |
 |
| target| Entity\|Array.<Entity>\|EntityCollection\|DataSource\|ImageryLayer\|Cesium3DTileset\|TimeDynamicPointCloud\|Promise.<(Entity\|Array.<Entity>\|EntityCollection\|DataSource\|ImageryLayer\|Cesium3DTileset\|TimeDynamicPointCloud\|VoxelPrimitive)>| The entity, array of entities, entity collection, data source, Cesium3DTileset, point cloud, or imagery layer to view. You can also pass a promise that resolves to one of the previously mentioned types. |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| duration| number| 3.0| optionalThe duration of the flight in seconds. |
| maximumHeight| number| | optionalThe maximum height at the peak of the flight. |
| offset| HeadingPitchRange| | optionalThe offset from the target in the local east-north-up reference frame centered at the target. |

### forceResize()
> This forces the widget to re-think its layout, including
widget sizes and credit placement. 

### isDestroyed()→boolean
### render()
> Renders the scene.  This function is called automatically
unless useDefaultRenderLoop is set to false; 

### resize()
> Resizes the widget to match the container size.
This function is called automatically as needed unless useDefaultRenderLoop is set to false. 

### zoomTo(target,offset)→Promise.<boolean>
> Asynchronously sets the camera to view the provided entity, entities, or data source.
If the data source is still in the process of loading or the visualization is otherwise still loading,
this method waits for the data to be ready before performing the zoom. The offset is heading/pitch/range in the local east-north-up reference frame centered at the center of the bounding sphere.
The heading and the pitch angles are defined in the local east-north-up reference frame.
The heading is the angle from y axis and increasing towards the x axis. Pitch is the rotation from the xy-plane. Positive pitch
angles are above the plane. Negative pitch angles are below the plane. The range is the distance from the center. If the range is
zero, a range will be computed such that the whole bounding sphere is visible. In 2D, there must be a top down view. The camera will be placed above the target looking down. The height above the
target will be the range. The heading will be determined from the offset. If the heading cannot be
determined from the offset, the heading will be north. 

| Name | Type | Description |
| --- | --- | --- |
 |
| target| Entity\|Array.<Entity>\|EntityCollection\|DataSource\|ImageryLayer\|Cesium3DTileset\|TimeDynamicPointCloud\|Promise.<(Entity\|Array.<Entity>\|EntityCollection\|DataSource\|ImageryLayer\|Cesium3DTileset\|TimeDynamicPointCloud\|VoxelPrimitive)>| The entity, array of entities, entity collection, data source, Cesium3DTileset, point cloud, or imagery layer to view. You can also pass a promise that resolves to one of the previously mentioned types. |
| offset| HeadingPitchRange| optionalThe offset from the center of the entity in the local east-north-up reference frame. |

## Type Definitions
### Cesium.Viewer.ConstructorOptions
> Initialization options for the Viewer constructor 

| Name | Type | Description |
| --- | --- | --- |
 |
| animation| boolean| <optional>| true| If set to false, the Animation widget will not be created. |
| baseLayerPicker| boolean| <optional>| true| If set to false, the BaseLayerPicker widget will not be created. |
| fullscreenButton| boolean| <optional>| true| If set to false, the FullscreenButton widget will not be created. |
| vrButton| boolean| <optional>| false| If set to true, the VRButton widget will be created. |
| geocoder| boolean\|IonGeocodeProviderType\|Array.<GeocoderService>| <optional>| IonGeocodeProviderType.DEFAULT| The geocoding service or services to use when searching with the Geocoder widget. If set to false, the Geocoder widget will not be created. |
| homeButton| boolean| <optional>| true| If set to false, the HomeButton widget will not be created. |
| infoBox| boolean| <optional>| true| If set to false, the InfoBox widget will not be created. |
| sceneModePicker| boolean| <optional>| true| If set to false, the SceneModePicker widget will not be created. |
| selectionIndicator| boolean| <optional>| true| If set to false, the SelectionIndicator widget will not be created. |
| timeline| boolean| <optional>| true| If set to false, the Timeline widget will not be created. |
| navigationHelpButton| boolean| <optional>| true| If set to false, the navigation help button will not be created. |
| navigationInstructionsInitiallyVisible| boolean| <optional>| true| True if the navigation instructions should initially be visible, or false if the should not be shown until the user explicitly clicks the button. |
| scene3DOnly| boolean| <optional>| false| Whentrue, each geometry instance will only be rendered in 3D to save GPU memory. |
| shouldAnimate| boolean| <optional>| false| trueif the clock should attempt to advance simulation time by default,falseotherwise.  This option takes precedence over settingViewer#clockViewModel. |
| clockViewModel| ClockViewModel| <optional>| new ClockViewModel(clock)| The clock view model to use to control current time. |
| selectedImageryProviderViewModel| ProviderViewModel| <optional>| | The view model for the current base imagery layer, if not supplied the first available base layer is used.  This value is only valid if `baseLayerPicker` is set to true. |
| imageryProviderViewModels| Array.<ProviderViewModel>| <optional>| createDefaultImageryProviderViewModels()| The array of ProviderViewModels to be selectable from the BaseLayerPicker.  This value is only valid if `baseLayerPicker` is set to true. |
| selectedTerrainProviderViewModel| ProviderViewModel| <optional>| | The view model for the current base terrain layer, if not supplied the first available base layer is used.  This value is only valid if `baseLayerPicker` is set to true. |
| terrainProviderViewModels| Array.<ProviderViewModel>| <optional>| createDefaultTerrainProviderViewModels()| The array of ProviderViewModels to be selectable from the BaseLayerPicker.  This value is only valid if `baseLayerPicker` is set to true. |
| baseLayer| ImageryLayer\|false| <optional>| ImageryLayer.fromWorldImagery()| The bottommost imagery layer applied to the globe. If set tofalse, no imagery provider will be added. This value is only valid if `baseLayerPicker` is set to false. Cannot be used when `globe` is set to false. |
| ellipsoid| Ellipsoid| <optional>| Ellipsoid.default| The default ellipsoid. |
| terrainProvider| TerrainProvider| <optional>| new EllipsoidTerrainProvider()| The terrain provider to use |
| terrain| Terrain| <optional>| | A terrain object which handles asynchronous terrain provider. Can only specify if options.terrainProvider is undefined. |
| skyBox| SkyBox\|false| <optional>| | The skybox used to render the stars. Whenundefinedand the WGS84 ellipsoid used, the default stars are used. If set tofalse, no skyBox, Sun, or Moon will be added. |
| skyAtmosphere| SkyAtmosphere\|false| <optional>| | Blue sky, and the glow around the Earth's limb. Enabled when the WGS84 ellipsoid used. Set tofalseto turn it off. |
| fullscreenElement| Element\|string| <optional>| document.body| The element or id to be placed into fullscreen mode when the full screen button is pressed. |
| useDefaultRenderLoop| boolean| <optional>| true| True if this widget should control the render loop, false otherwise. |
| targetFrameRate| number| <optional>| | The target frame rate when using the default render loop. |
| showRenderLoopErrors| boolean| <optional>| true| If true, this widget will automatically display an HTML panel to the user containing the error, if a render loop error occurs. |
| useBrowserRecommendedResolution| boolean| <optional>| true| If true, render at the browser's recommended resolution and ignorewindow.devicePixelRatio. |
| automaticallyTrackDataSourceClocks| boolean| <optional>| true| If true, this widget will automatically track the clock settings of newly added DataSources, updating if the DataSource's clock changes.  Set this to false if you want to configure the clock independently. |
| contextOptions| ContextOptions| <optional>| | Context and WebGL creation properties passed toScene. |
| sceneMode| SceneMode| <optional>| SceneMode.SCENE3D| The initial scene mode. |
| mapProjection| MapProjection| <optional>| new GeographicProjection(options.ellipsoid)| The map projection to use in 2D and Columbus View modes. |
| globe| Globe\|false| <optional>| new Globe(options.ellipsoid)| The globe to use in the scene.  If set tofalse, no globe will be added and the sky atmosphere will be hidden by default. |
| orderIndependentTranslucency| boolean| <optional>| true| If true and the configuration supports it, use order independent translucency. |
| creditContainer| Element\|string| <optional>| | The DOM element or ID that will contain theCreditDisplay.  If not specified, the credits are added to the bottom of the widget itself. |
| creditViewport| Element\|string| <optional>| | The DOM element or ID that will contain the credit pop up created by theCreditDisplay.  If not specified, it will appear over the widget itself. |
| dataSources| DataSourceCollection| <optional>| new DataSourceCollection()| The collection of data sources visualized by the widget.  If this parameter is provided,                               the instance is assumed to be owned by the caller and will not be destroyed when the viewer is destroyed. |
| shadows| boolean| <optional>| false| Determines if shadows are cast by light sources. |
| terrainShadows| ShadowMode| <optional>| ShadowMode.RECEIVE_ONLY| Determines if the terrain casts or receives shadows from light sources. |
| mapMode2D| MapMode2D| <optional>| MapMode2D.INFINITE_SCROLL| Determines if the 2D map is rotatable or can be scrolled infinitely in the horizontal direction. |
| projectionPicker| boolean| <optional>| false| If set to true, the ProjectionPicker widget will be created. |
| blurActiveElementOnCanvasFocus| boolean| <optional>| true| If true, the active element will blur when the viewer's canvas is clicked. Setting this to false is useful for cases when the canvas is clicked only for retrieving position or an entity data without actually meaning to set the canvas to be the active element. |
| requestRenderMode| boolean| <optional>| false| If true, rendering a frame will only occur when needed as determined by changes within the scene. Enabling reduces the CPU/GPU usage of your application and uses less battery on mobile, but requires usingScene#requestRenderto render a new frame explicitly in this mode. This will be necessary in many cases after making changes to the scene in other parts of the API. SeeImproving Performance with Explicit Rendering. |
| maximumRenderTimeChange| number| <optional>| 0.0| If requestRenderMode is true, this value defines the maximum change in simulation time allowed before a render is requested. SeeImproving Performance with Explicit Rendering. |
| depthPlaneEllipsoidOffset| number| <optional>| 0.0| Adjust the DepthPlane to address rendering artefacts below ellipsoid zero elevation. |
| msaaSamples| number| <optional>| 4| If provided, this value controls the rate of multisample antialiasing. Typical multisampling rates are 2, 4, and sometimes 8 samples per pixel. Higher sampling rates of MSAA may impact performance in exchange for improved visual quality. This value only applies to WebGL2 contexts that support multisample render targets. Set to 1 to disable MSAA. |

### Cesium.Viewer.ViewerMixin(viewer, options)
> A function that augments a Viewer instance with additional functionality. 

| Name | Type | Description |
| --- | --- | --- |
 |
| viewer| Viewer| The viewer instance. |
| options| object| Options object to be passed to the mixin function. |


---

# Camera
### new Cesium.Camera(scene)
> The camera is defined by a position, orientation, and view frustum. The orientation forms an orthonormal basis with a view, up and right = view x up unit vectors. The viewing frustum is defined by 6 planes.
Each plane is represented by a Cartesian4 object, where the x, y, and z components
define the unit vector normal to the plane, and the w component is the distance of the
plane from the origin/camera position. 

| Name | Type | Description |
| --- | --- | --- |
 |
| scene| Scene| The scene. |

## Members
### staticCesium.Camera.DEFAULT_OFFSET:HeadingPitchRange
> The default heading/pitch/range that is used when the camera flies to a location that contains a bounding sphere. 

### staticCesium.Camera.DEFAULT_VIEW_FACTOR: number
> A scalar to multiply to the camera position and add it back after setting the camera to view the rectangle.
A value of zero means the camera will view the entire Camera#DEFAULT_VIEW_RECTANGLE , a value greater than zero
will move it further away from the extent, and a value less than zero will move it close to the extent. 

### staticCesium.Camera.DEFAULT_VIEW_RECTANGLE:Rectangle
> The default rectangle the camera will view on creation. 

### readonlychanged:Event
> Gets the event that will be raised when the camera has changed by percentageChanged . 

### constrainedAxis:Cartesian3|undefined
> If set, the camera will not be able to rotate past this axis in either direction. 

### defaultLookAmount: number
> The default amount to rotate the camera when an argument is not
provided to the look methods. 

### defaultMoveAmount: number
> The default amount to move the camera when an argument is not
provided to the move methods. 

### defaultRotateAmount: number
> The default amount to rotate the camera when an argument is not
provided to the rotate methods. 

### defaultZoomAmount: number
> The default amount to move the camera when an argument is not
provided to the zoom methods. 

### direction:Cartesian3
> The view direction of the camera. 

### readonlydirectionWC:Cartesian3
> Gets the view direction of the camera in world coordinates. 

### frustum:PerspectiveFrustum|PerspectiveOffCenterFrustum|OrthographicFrustum
> The region of space in view. 

### readonlyheading: number
> Gets the camera heading in radians. 

### readonlyinverseTransform:Matrix4
> Gets the inverse camera transform. 

### readonlyinverseViewMatrix:Matrix4
> Gets the inverse view matrix. 

### maximumZoomFactor: number
> The factor multiplied by the the map size used to determine where to clamp the camera position
when zooming out from the surface. The default is 1.5. Only valid for 2D and the map is rotatable. 

### readonlymoveEnd:Event
> Gets the event that will be raised when the camera has stopped moving. 

### readonlymoveStart:Event
> Gets the event that will be raised at when the camera starts to move. 

### percentageChanged: number
> The amount the camera has to change before the changed event is raised. The value is a percentage in the [0, 1] range. 

### readonlypitch: number
> Gets the camera pitch in radians. 

### position:Cartesian3
> The position of the camera. 

### readonlypositionCartographic:Cartographic
> Gets the Cartographic position of the camera, with longitude and latitude
expressed in radians and height in meters.  In 2D and Columbus View, it is possible
for the returned longitude and latitude to be outside the range of valid longitudes
and latitudes when the camera is outside the map. 

### readonlypositionWC:Cartesian3
> Gets the position of the camera in world coordinates. 

### right:Cartesian3
> The right direction of the camera. 

### readonlyrightWC:Cartesian3
> Gets the right direction of the camera in world coordinates. 

### readonlyroll: number
> Gets the camera roll in radians. 

### readonlytransform:Matrix4
> Gets the camera's reference frame. The inverse of this transformation is appended to the view matrix. 

### up:Cartesian3
> The up direction of the camera. 

### readonlyupWC:Cartesian3
> Gets the up direction of the camera in world coordinates. 

### readonlyviewMatrix:Matrix4
> Gets the view matrix. 

## Methods
### cameraToWorldCoordinates(cartesian,result)→Cartesian4
> Transform a vector or point from the camera's reference frame to world coordinates. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian4| The vector or point to transform. |
| result| Cartesian4| optionalThe object onto which to store the result. |

### cameraToWorldCoordinatesPoint(cartesian,result)→Cartesian3
> Transform a point from the camera's reference frame to world coordinates. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The point to transform. |
| result| Cartesian3| optionalThe object onto which to store the result. |

### cameraToWorldCoordinatesVector(cartesian,result)→Cartesian3
> Transform a vector from the camera's reference frame to world coordinates. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The vector to transform. |
| result| Cartesian3| optionalThe object onto which to store the result. |

### cancelFlight()
> Cancels the current camera flight and leaves the camera at its current location.
If no flight is in progress, this function does nothing. 

### completeFlight()
> Completes the current camera flight and moves the camera immediately to its final destination.
If no flight is in progress, this function does nothing. 

### computeViewRectangle(ellipsoid,result)→Rectangle|undefined
> Computes the approximate visible rectangle on the ellipsoid. 

| Name | Type | Description |
| --- | --- | --- |
 |
| ellipsoid| Ellipsoid| Ellipsoid.default| optionalThe ellipsoid that you want to know the visible region. |
| result| Rectangle| | optionalThe rectangle in which to store the result |

### distanceToBoundingSphere(boundingSphere)→number
> Return the distance from the camera to the front of the bounding sphere. 

| Name | Type | Description |
| --- | --- | --- |
 |
| boundingSphere| BoundingSphere| The bounding sphere in world coordinates. |

### flyHome(duration)
> Fly the camera to the home view.  Use Camera#.DEFAULT_VIEW_RECTANGLE to set
the default view for the 3D scene.  The home view for 2D and columbus view shows the
entire map. 

| Name | Type | Description |
| --- | --- | --- |
 |
| duration| number| optionalThe duration of the flight in seconds. If omitted, Cesium attempts to calculate an ideal duration based on the distance to be traveled by the flight. SeeCamera#flyTo |

### flyTo(options)
> Flies the camera from its current position to a new position. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| Object with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| destination| Cartesian3\|Rectangle| The final position of the camera in world coordinates or a rectangle that would be visible from a top-down view. |
| orientation| object| optionalAn object that contains either direction and up properties or heading, pitch and roll properties. By default, the direction will point towards the center of the frame in 3D and in the negative z direction in Columbus view. The up direction will point towards local north in 3D and in the positive y direction in Columbus view.  Orientation is not used in 2D when in infinite scrolling mode. |
| duration| number| optionalThe duration of the flight in seconds. If omitted, Cesium attempts to calculate an ideal duration based on the distance to be traveled by the flight. |
| complete| Camera.FlightCompleteCallback| optionalThe function to execute when the flight is complete. |
| cancel| Camera.FlightCancelledCallback| optionalThe function to execute if the flight is cancelled. |
| endTransform| Matrix4| optionalTransform matrix representing the reference frame the camera will be in when the flight is completed. |
| maximumHeight| number| optionalThe maximum height at the peak of the flight. |
| pitchAdjustHeight| number| optionalIf camera flyes higher than that value, adjust pitch duiring the flight to look down, and keep Earth in viewport. |
| flyOverLongitude| number| optionalThere are always two ways between 2 points on globe. This option force camera to choose fight direction to fly over that longitude. |
| flyOverLongitudeWeight| number| optionalFly over the lon specifyed via flyOverLongitude only if that way is not longer than short way times flyOverLongitudeWeight. |
| convert| boolean| optionalWhether to convert the destination from world coordinates to scene coordinates (only relevant when not using 3D). Defaults totrue. |
| easingFunction| EasingFunction.Callback| optionalControls how the time is interpolated over the duration of the flight. |

### flyToBoundingSphere(boundingSphere,options)
> Flies the camera to a location where the current view contains the provided bounding sphere. The offset is heading/pitch/range in the local east-north-up reference frame centered at the center of the bounding sphere.
The heading and the pitch angles are defined in the local east-north-up reference frame.
The heading is the angle from y axis and increasing towards the x axis. Pitch is the rotation from the xy-plane. Positive pitch
angles are below the plane. Negative pitch angles are above the plane. The range is the distance from the center. If the range is
zero, a range will be computed such that the whole bounding sphere is visible. In 2D and Columbus View, there must be a top down view. The camera will be placed above the target looking down. The height above the
target will be the range. The heading will be aligned to local north. 

| Name | Type | Description |
| --- | --- | --- |
 |
| boundingSphere| BoundingSphere| The bounding sphere to view, in world coordinates. |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| duration| number| optionalThe duration of the flight in seconds. If omitted, Cesium attempts to calculate an ideal duration based on the distance to be traveled by the flight. |
| offset| HeadingPitchRange| optionalThe offset from the target in the local east-north-up reference frame centered at the target. |
| complete| Camera.FlightCompleteCallback| optionalThe function to execute when the flight is complete. |
| cancel| Camera.FlightCancelledCallback| optionalThe function to execute if the flight is cancelled. |
| endTransform| Matrix4| optionalTransform matrix representing the reference frame the camera will be in when the flight is completed. |
| maximumHeight| number| optionalThe maximum height at the peak of the flight. |
| pitchAdjustHeight| number| optionalIf camera flyes higher than that value, adjust pitch duiring the flight to look down, and keep Earth in viewport. |
| flyOverLongitude| number| optionalThere are always two ways between 2 points on globe. This option force camera to choose fight direction to fly over that longitude. |
| flyOverLongitudeWeight| number| optionalFly over the lon specifyed via flyOverLongitude only if that way is not longer than short way times flyOverLongitudeWeight. |
| easingFunction| EasingFunction.Callback| optionalControls how the time is interpolated over the duration of the flight. |

### getMagnitude()→number
> Gets the magnitude of the camera position. In 3D, this is the vector magnitude. In 2D and
Columbus view, this is the distance to the map. 

### getPickRay(windowPosition,result)→Ray|undefined
> Create a ray from the camera position through the pixel at windowPosition in world coordinates. 

| Name | Type | Description |
| --- | --- | --- |
 |
| windowPosition| Cartesian2| The x and y coordinates of a pixel. |
| result| Ray| optionalThe object onto which to store the result. |

### getPixelSize(boundingSphere, drawingBufferWidth, drawingBufferHeight)→number
> Return the pixel size in meters. 

| Name | Type | Description |
| --- | --- | --- |
 |
| boundingSphere| BoundingSphere| The bounding sphere in world coordinates. |
| drawingBufferWidth| number| The drawing buffer width. |
| drawingBufferHeight| number| The drawing buffer height. |

### getRectangleCameraCoordinates(rectangle,result)→Cartesian3
> Get the camera position needed to view a rectangle on an ellipsoid or map 

| Name | Type | Description |
| --- | --- | --- |
 |
| rectangle| Rectangle| The rectangle to view. |
| result| Cartesian3| optionalThe camera position needed to view the rectangle |

### look(axis,angle)
> Rotate each of the camera's orientation vectors around axis by angle 

| Name | Type | Description |
| --- | --- | --- |
 |
| axis| Cartesian3| The axis to rotate around. |
| angle| number| optionalThe angle, in radians, to rotate by. Defaults todefaultLookAmount. |

### lookAt(target, offset)
> Sets the camera position and orientation using a target and offset. The target must be given in
world coordinates. The offset can be either a cartesian or heading/pitch/range in the local east-north-up reference frame centered at the target.
If the offset is a cartesian, then it is an offset from the center of the reference frame defined by the transformation matrix. If the offset
is heading/pitch/range, then the heading and the pitch angles are defined in the reference frame defined by the transformation matrix.
The heading is the angle from y axis and increasing towards the x axis. Pitch is the rotation from the xy-plane. Positive pitch
angles are below the plane. Negative pitch angles are above the plane. The range is the distance from the center.

In 2D, there must be a top down view. The camera will be placed above the target looking down. The height above the
target will be the magnitude of the offset. The heading will be determined from the offset. If the heading cannot be
determined from the offset, the heading will be north. 

| Name | Type | Description |
| --- | --- | --- |
 |
| target| Cartesian3| The target position in world coordinates. |
| offset| Cartesian3\|HeadingPitchRange| The offset from the target in the local east-north-up reference frame centered at the target. |

### lookAtTransform(transform,offset)
> Sets the camera position and orientation using a target and transformation matrix. The offset can be either a cartesian or heading/pitch/range.
If the offset is a cartesian, then it is an offset from the center of the reference frame defined by the transformation matrix. If the offset
is heading/pitch/range, then the heading and the pitch angles are defined in the reference frame defined by the transformation matrix.
The heading is the angle from y axis and increasing towards the x axis. Pitch is the rotation from the xy-plane. Positive pitch
angles are below the plane. Negative pitch angles are above the plane. The range is the distance from the center.

In 2D, there must be a top down view. The camera will be placed above the center of the reference frame. The height above the
target will be the magnitude of the offset. The heading will be determined from the offset. If the heading cannot be
determined from the offset, the heading will be north. 

| Name | Type | Description |
| --- | --- | --- |
 |
| transform| Matrix4| The transformation matrix defining the reference frame. |
| offset| Cartesian3\|HeadingPitchRange| optionalThe offset from the target in a reference frame centered at the target. |

### lookDown(amount)
> Rotates the camera around its right vector by amount, in radians, in the opposite direction
of its up vector if not in 2D mode. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount, in radians, to rotate by. Defaults todefaultLookAmount. |

### lookLeft(amount)
> Rotates the camera around its up vector by amount, in radians, in the opposite direction
of its right vector if not in 2D mode. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount, in radians, to rotate by. Defaults todefaultLookAmount. |

### lookRight(amount)
> Rotates the camera around its up vector by amount, in radians, in the direction
of its right vector if not in 2D mode. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount, in radians, to rotate by. Defaults todefaultLookAmount. |

### lookUp(amount)
> Rotates the camera around its right vector by amount, in radians, in the direction
of its up vector if not in 2D mode. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount, in radians, to rotate by. Defaults todefaultLookAmount. |

### move(direction,amount)
> Translates the camera's position by amount along direction . 

| Name | Type | Description |
| --- | --- | --- |
 |
| direction| Cartesian3| The direction to move. |
| amount| number| optionalThe amount, in meters, to move. Defaults todefaultMoveAmount. |

### moveBackward(amount)
> Translates the camera's position by amount along the opposite direction
of the camera's view vector.
When in 2D mode, this will zoom out the camera instead of translating the camera's position. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount, in meters, to move. Defaults todefaultMoveAmount. |

### moveDown(amount)
> Translates the camera's position by amount along the opposite direction
of the camera's up vector. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount, in meters, to move. Defaults todefaultMoveAmount. |

### moveForward(amount)
> Translates the camera's position by amount along the camera's view vector.
When in 2D mode, this will zoom in the camera instead of translating the camera's position. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount, in meters, to move. Defaults todefaultMoveAmount. |

### moveLeft(amount)
> Translates the camera's position by amount along the opposite direction
of the camera's right vector. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount, in meters, to move. Defaults todefaultMoveAmount. |

### moveRight(amount)
> Translates the camera's position by amount along the camera's right vector. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount, in meters, to move. Defaults todefaultMoveAmount. |

### moveUp(amount)
> Translates the camera's position by amount along the camera's up vector. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount, in meters, to move. Defaults todefaultMoveAmount. |

### pickEllipsoid(windowPosition,ellipsoid,result)→Cartesian3|undefined
> Pick an ellipsoid or map. 

| Name | Type | Description |
| --- | --- | --- |
 |
| windowPosition| Cartesian2| | The x and y coordinates of a pixel. |
| ellipsoid| Ellipsoid| Ellipsoid.default| optionalThe ellipsoid to pick. |
| result| Cartesian3| | optionalThe object onto which to store the result. |

### rotate(axis,angle)
> Rotates the camera around axis by angle . The distance
of the camera's position to the center of the camera's reference frame remains the same. 

| Name | Type | Description |
| --- | --- | --- |
 |
| axis| Cartesian3| The axis to rotate around given in world coordinates. |
| angle| number| optionalThe angle, in radians, to rotate by. Defaults todefaultRotateAmount. |

### rotateDown(angle)
> Rotates the camera around the center of the camera's reference frame by angle downwards. 

| Name | Type | Description |
| --- | --- | --- |
 |
| angle| number| optionalThe angle, in radians, to rotate by. Defaults todefaultRotateAmount. |

### rotateLeft(angle)
> Rotates the camera around the center of the camera's reference frame by angle to the left. 

| Name | Type | Description |
| --- | --- | --- |
 |
| angle| number| optionalThe angle, in radians, to rotate by. Defaults todefaultRotateAmount. |

### rotateRight(angle)
> Rotates the camera around the center of the camera's reference frame by angle to the right. 

| Name | Type | Description |
| --- | --- | --- |
 |
| angle| number| optionalThe angle, in radians, to rotate by. Defaults todefaultRotateAmount. |

### rotateUp(angle)
> Rotates the camera around the center of the camera's reference frame by angle upwards. 

| Name | Type | Description |
| --- | --- | --- |
 |
| angle| number| optionalThe angle, in radians, to rotate by. Defaults todefaultRotateAmount. |

### setView(options)
> Sets the camera position, orientation and transform. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| Object with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| destination| Cartesian3\|Rectangle| optionalThe final position of the camera in world coordinates or a rectangle that would be visible from a top-down view. |
| orientation| HeadingPitchRollValues\|DirectionUp| optionalAn object that contains either direction and up properties or heading, pitch and roll properties. By default, the direction will point towards the center of the frame in 3D and in the negative z direction in Columbus view. The up direction will point towards local north in 3D and in the positive y direction in Columbus view. Orientation is not used in 2D when in infinite scrolling mode. |
| endTransform| Matrix4| optionalTransform matrix representing the reference frame of the camera. |
| convert| boolean| optionalWhether to convert the destination from world coordinates to scene coordinates (only relevant when not using 3D). Defaults totrue. |

### switchToOrthographicFrustum()
> Switches the frustum/projection to orthographic.

This function is a no-op in 2D which will always be orthographic. 

### switchToPerspectiveFrustum()
> Switches the frustum/projection to perspective.

This function is a no-op in 2D which must always be orthographic. 

### twistLeft(amount)
> Rotate the camera counter-clockwise around its direction vector by amount, in radians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount, in radians, to rotate by. Defaults todefaultLookAmount. |

### twistRight(amount)
> Rotate the camera clockwise around its direction vector by amount, in radians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount, in radians, to rotate by. Defaults todefaultLookAmount. |

### viewBoundingSphere(boundingSphere,offset)
> Sets the camera so that the current view contains the provided bounding sphere. The offset is heading/pitch/range in the local east-north-up reference frame centered at the center of the bounding sphere.
The heading and the pitch angles are defined in the local east-north-up reference frame.
The heading is the angle from y axis and increasing towards the x axis. Pitch is the rotation from the xy-plane. Positive pitch
angles are below the plane. Negative pitch angles are above the plane. The range is the distance from the center. If the range is
zero, a range will be computed such that the whole bounding sphere is visible. In 2D, there must be a top down view. The camera will be placed above the target looking down. The height above the
target will be the range. The heading will be determined from the offset. If the heading cannot be
determined from the offset, the heading will be north. 

| Name | Type | Description |
| --- | --- | --- |
 |
| boundingSphere| BoundingSphere| The bounding sphere to view, in world coordinates. |
| offset| HeadingPitchRange| optionalThe offset from the target in the local east-north-up reference frame centered at the target. |

### worldToCameraCoordinates(cartesian,result)→Cartesian4
> Transform a vector or point from world coordinates to the camera's reference frame. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian4| The vector or point to transform. |
| result| Cartesian4| optionalThe object onto which to store the result. |

### worldToCameraCoordinatesPoint(cartesian,result)→Cartesian3
> Transform a point from world coordinates to the camera's reference frame. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The point to transform. |
| result| Cartesian3| optionalThe object onto which to store the result. |

### worldToCameraCoordinatesVector(cartesian,result)→Cartesian3
> Transform a vector from world coordinates to the camera's reference frame. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The vector to transform. |
| result| Cartesian3| optionalThe object onto which to store the result. |

### zoomIn(amount)
> Zooms amount along the camera's view vector. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount to move. Defaults todefaultZoomAmount. |

### zoomOut(amount)
> Zooms amount along the opposite direction of
the camera's view vector. 

| Name | Type | Description |
| --- | --- | --- |
 |
| amount| number| optionalThe amount to move. Defaults todefaultZoomAmount. |

## Type Definitions
### Cesium.Camera.FlightCancelledCallback()
> A function that will execute when a flight is cancelled. 

### Cesium.Camera.FlightCompleteCallback()
> A function that will execute when a flight completes. 


---

# Entity
### new Cesium.Entity(options)
> Entity instances aggregate multiple forms of visualization into a single high-level object.
They can be created manually and added to Viewer#entities or be produced by
data sources, such as CzmlDataSource and GeoJsonDataSource . 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| Entity.ConstructorOptions| optionalObject describing initialization options |

## Members
### availability:TimeIntervalCollection|undefined
> The availability, if any, associated with this object.
If availability is undefined, it is assumed that this object's
other properties will return valid data for any provided time.
If availability exists, the objects other properties will only
provide valid data if queried within the given interval. 

### billboard:BillboardGraphics|undefined
> Gets or sets the billboard. 

### box:BoxGraphics|undefined
> Gets or sets the box. 

### corridor:CorridorGraphics|undefined
> Gets or sets the corridor. 

### cylinder:CylinderGraphics|undefined
> Gets or sets the cylinder. 

### readonlydefinitionChanged:Event
> Gets the event that is raised whenever a property or sub-property is changed or modified. 

### description:Property|undefined
> Gets or sets the description. 

### ellipse:EllipseGraphics|undefined
> Gets or sets the ellipse. 

### ellipsoid:EllipsoidGraphics|undefined
> Gets or sets the ellipsoid. 

### entityCollection:EntityCollection
> Gets or sets the entity collection that this entity belongs to. 

### id: string
> Gets the unique ID associated with this object. 

### isShowing: boolean
> Gets whether this entity is being displayed, taking into account
the visibility of any ancestor entities. 

### label:LabelGraphics|undefined
> Gets or sets the label. 

### model:ModelGraphics|undefined
> Gets or sets the model. 

### name: string|undefined
> Gets or sets the name of the object.  The name is intended for end-user
consumption and does not need to be unique. 

### orientation:Property|undefined
> Gets or sets the orientation in respect to Earth-fixed-Earth-centered (ECEF).
Defaults to east-north-up at entity position. 

### parent:Entity|undefined
> Gets or sets the parent object. 

### path:PathGraphics|undefined
> Gets or sets the path. 

### plane:PlaneGraphics|undefined
> Gets or sets the plane. 

### point:PointGraphics|undefined
> Gets or sets the point graphic. 

### polygon:PolygonGraphics|undefined
> Gets or sets the polygon. 

### polyline:PolylineGraphics|undefined
> Gets or sets the polyline. 

### polylineVolume:PolylineVolumeGraphics|undefined
> Gets or sets the polyline volume. 

### position:PositionProperty|undefined
> Gets or sets the position. 

### properties:PropertyBag|undefined
> Gets or sets the bag of arbitrary properties associated with this entity. 

### propertyNames: Array.<string>
> Gets the names of all properties registered on this instance. 

### rectangle:RectangleGraphics|undefined
> Gets or sets the rectangle. 

### show: boolean
> Gets or sets whether this entity should be displayed. When set to true,
the entity is only displayed if the parent entity's show property is also true. 

### tileset:Cesium3DTilesetGraphics|undefined
> Gets or sets the tileset. 

### trackingReferenceFrame:TrackingReferenceFrame
> Gets or sets the entity's tracking reference frame. 

### viewFrom:Property|undefined
> Gets or sets the suggested initial offset when tracking this object.
The offset is typically defined in the east-north-up reference frame,
but may be another frame depending on the object's velocity. 

### wall:WallGraphics|undefined
> Gets or sets the wall. 

## Methods
### staticCesium.Entity.supportsMaterialsforEntitiesOnTerrain(scene)→boolean
> Checks if the given Scene supports materials besides Color on Entities draped on terrain or 3D Tiles.
If this feature is not supported, Entities with non-color materials but no `height` will
instead be rendered as if height is 0. 

| Name | Type | Description |
| --- | --- | --- |
 |
| scene| Scene| The current scene. |

### staticCesium.Entity.supportsPolylinesOnTerrain(scene)→boolean
> Checks if the given Scene supports polylines clamped to terrain or 3D Tiles.
If this feature is not supported, Entities with PolylineGraphics will be rendered with vertices at
the provided heights and using the `arcType` parameter instead of clamped to the ground. 

| Name | Type | Description |
| --- | --- | --- |
 |
| scene| Scene| The current scene. |

### addProperty(propertyName)
> Adds a property to this object.  Once a property is added, it can be
observed with Entity#definitionChanged and composited
with CompositeEntityCollection 

| Name | Type | Description |
| --- | --- | --- |
 |
| propertyName| string| The name of the property to add. |

### computeModelMatrix(time,result)→Matrix4
> Computes the model matrix for the entity's transform at specified time. Returns undefined if position is undefined 

| Name | Type | Description |
| --- | --- | --- |
 |
| time| JulianDate| The time to retrieve model matrix for. |
| result| Matrix4| optionalThe object onto which to store the result. |

### isAvailable(time)→boolean
> Given a time, returns true if this object should have data during that time. 

| Name | Type | Description |
| --- | --- | --- |
 |
| time| JulianDate| The time to check availability for. |

### merge(source)
> Assigns each unassigned property on this object to the value
of the same property on the provided source object. 

| Name | Type | Description |
| --- | --- | --- |
 |
| source| Entity| The object to be merged into this object. |

### removeProperty(propertyName)
> Removed a property previously added with addProperty. 

| Name | Type | Description |
| --- | --- | --- |
 |
| propertyName| string| The name of the property to remove. |

## Type Definitions
### Cesium.Entity.ConstructorOptions
> Initialization options for the Entity constructor 

| Name | Type | Description |
| --- | --- | --- |
 |
| id| string| <optional>| | A unique identifier for this object. If none is provided, a GUID is generated. |
| name| string| <optional>| | A human readable name to display to users. It does not have to be unique. |
| availability| TimeIntervalCollection| <optional>| | The availability, if any, associated with this object. |
| show| boolean| <optional>| | A boolean value indicating if the entity and its children are displayed. |
| trackingReferenceFrame| TrackingReferenceFrame| <optional>| TrackingReferenceFrame.AUTODETECT| The reference frame used when this entity is being tracked.Ifundefined, reference frame is determined based on entity velocity: near-surface slow moving entities are tracked using the local east-north-up reference frame, whereas fast moving entities such as satellites are tracked using VVLH (Vehicle Velocity, Local Horizontal). |
| description| Property\|string| <optional>| | A string Property specifying an HTML description for this entity. |
| position| PositionProperty\|Cartesian3\|CallbackPositionProperty| <optional>| | A Property specifying the entity position. |
| orientation| Property\|Quaternion| <optional>| Transforms.eastNorthUpToFixedFrame(position)| A Property specifying the entity orientation in respect to Earth-fixed-Earth-centered (ECEF). If undefined, east-north-up at entity position is used. |
| viewFrom| Property\|Cartesian3| <optional>| | A suggested initial offset for viewing this object. |
| parent| Entity| <optional>| | A parent entity to associate with this entity. |
| billboard| BillboardGraphics\|BillboardGraphics.ConstructorOptions| <optional>| | A billboard to associate with this entity. |
| box| BoxGraphics\|BoxGraphics.ConstructorOptions| <optional>| | A box to associate with this entity. |
| corridor| CorridorGraphics\|CorridorGraphics.ConstructorOptions| <optional>| | A corridor to associate with this entity. |
| cylinder| CylinderGraphics\|CylinderGraphics.ConstructorOptions| <optional>| | A cylinder to associate with this entity. |
| ellipse| EllipseGraphics\|EllipseGraphics.ConstructorOptions| <optional>| | A ellipse to associate with this entity. |
| ellipsoid| EllipsoidGraphics\|EllipsoidGraphics.ConstructorOptions| <optional>| | A ellipsoid to associate with this entity. |
| label| LabelGraphics\|LabelGraphics.ConstructorOptions| <optional>| | A options.label to associate with this entity. |
| model| ModelGraphics\|ModelGraphics.ConstructorOptions| <optional>| | A model to associate with this entity. |
| tileset| Cesium3DTilesetGraphics\|Cesium3DTilesetGraphics.ConstructorOptions| <optional>| | A 3D Tiles tileset to associate with this entity. |
| path| PathGraphics\|PathGraphics.ConstructorOptions| <optional>| | A path to associate with this entity. |
| plane| PlaneGraphics\|PlaneGraphics.ConstructorOptions| <optional>| | A plane to associate with this entity. |
| point| PointGraphics\|PointGraphics.ConstructorOptions| <optional>| | A point to associate with this entity. |
| polygon| PolygonGraphics\|PolygonGraphics.ConstructorOptions| <optional>| | A polygon to associate with this entity. |
| polyline| PolylineGraphics\|PolylineGraphics.ConstructorOptions| <optional>| | A polyline to associate with this entity. |
| properties| PropertyBag\|Object.<string, *>| <optional>| | Arbitrary properties to associate with this entity. |
| polylineVolume| PolylineVolumeGraphics\|PolylineVolumeGraphics.ConstructorOptions| <optional>| | A polylineVolume to associate with this entity. |
| rectangle| RectangleGraphics\|RectangleGraphics.ConstructorOptions| <optional>| | A rectangle to associate with this entity. |
| wall| WallGraphics\|WallGraphics.ConstructorOptions| <optional>| | A wall to associate with this entity. |


---

# EntityCollection
### new Cesium.EntityCollection(owner)
> An observable collection of Entity instances where each entity has a unique id. 

| Name | Type | Description |
| --- | --- | --- |
 |
| owner| DataSource\|CompositeEntityCollection| optionalThe data source (or composite entity collection) which created this collection. |

## Members
### readonlycollectionChanged:Event.<EntityCollection.CollectionChangedEventCallback>
> Gets the event that is fired when entities are added or removed from the collection.
The generated event is a EntityCollection.CollectionChangedEventCallback . 

### readonlyid: string
> Gets a globally unique identifier for this collection. 

### readonlyowner:DataSource|CompositeEntityCollection
> Gets the owner of this entity collection, ie. the data source or composite entity collection which created it. 

### show: boolean
> Gets whether or not this entity collection should be
displayed.  When true, each entity is only displayed if
its own show property is also true. 

### readonlyvalues: Array.<Entity>
> Gets the array of Entity instances in the collection.
This array should not be modified directly. 

## Methods
### add(entity)→Entity
> Add an entity to the collection. 

| Name | Type | Description |
| --- | --- | --- |
 |
| entity| Entity\|Entity.ConstructorOptions| The entity to be added. |

### computeAvailability()→TimeInterval
> Computes the maximum availability of the entities in the collection.
If the collection contains a mix of infinitely available data and non-infinite data,
it will return the interval pertaining to the non-infinite data only.  If all
data is infinite, an infinite interval will be returned. 

### contains(entity)→boolean
> Returns true if the provided entity is in this collection, false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| entity| Entity| The entity. |

### getById(id)→Entity|undefined
> Gets an entity with the specified id. 

| Name | Type | Description |
| --- | --- | --- |
 |
| id| string| The id of the entity to retrieve. |

### getOrCreateEntity(id)→Entity
> Gets an entity with the specified id or creates it and adds it to the collection if it does not exist. 

| Name | Type | Description |
| --- | --- | --- |
 |
| id| string| The id of the entity to retrieve or create. |

### remove(entity)→boolean
> Removes an entity from the collection. 

| Name | Type | Description |
| --- | --- | --- |
 |
| entity| Entity| The entity to be removed. |

### removeAll()
> Removes all Entities from the collection. 

### removeById(id)→boolean
> Removes an entity with the provided id from the collection. 

| Name | Type | Description |
| --- | --- | --- |
 |
| id| string| The id of the entity to remove. |

### resumeEvents()
> Resumes raising EntityCollection#collectionChanged events immediately
when an item is added or removed.  Any modifications made while while events were suspended
will be triggered as a single event when this function is called.
This function is reference counted and can safely be called multiple times as long as there
are corresponding calls to EntityCollection#resumeEvents . 

### suspendEvents()
> Prevents EntityCollection#collectionChanged events from being raised
until a corresponding call is made to EntityCollection#resumeEvents , at which
point a single event will be raised that covers all suspended operations.
This allows for many items to be added and removed efficiently.
This function can be safely called multiple times as long as there
are corresponding calls to EntityCollection#resumeEvents . 

## Type Definitions
### Cesium.EntityCollection.CollectionChangedEventCallback(collection, added, removed, changed)
> The signature of the event generated by EntityCollection#collectionChanged . 

| Name | Type | Description |
| --- | --- | --- |
 |
| collection| EntityCollection| The collection that triggered the event. |
| added| Array.<Entity>| The array ofEntityinstances that have been added to the collection. |
| removed| Array.<Entity>| The array ofEntityinstances that have been removed from the collection. |
| changed| Array.<Entity>| The array ofEntityinstances that have been modified. |


---

# Cartesian3
> A 3D Cartesian point. 

### new Cesium.Cartesian3(x,y,z)
| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| 0.0| optionalThe X component. |
| y| number| 0.0| optionalThe Y component. |
| z| number| 0.0| optionalThe Z component. |

## Members
### x: number
> The X component. 

### y: number
> The Y component. 

### z: number
> The Z component. 

### staticconstantCesium.Cartesian3.ONE:Cartesian3
> An immutable Cartesian3 instance initialized to (1.0, 1.0, 1.0). 

### staticCesium.Cartesian3.packedLength: number
> The number of elements used to pack the object into an array. 

### staticconstantCesium.Cartesian3.UNIT_X:Cartesian3
> An immutable Cartesian3 instance initialized to (1.0, 0.0, 0.0). 

### staticconstantCesium.Cartesian3.UNIT_Y:Cartesian3
> An immutable Cartesian3 instance initialized to (0.0, 1.0, 0.0). 

### staticconstantCesium.Cartesian3.UNIT_Z:Cartesian3
> An immutable Cartesian3 instance initialized to (0.0, 0.0, 1.0). 

### staticconstantCesium.Cartesian3.ZERO:Cartesian3
> An immutable Cartesian3 instance initialized to (0.0, 0.0, 0.0). 

## Methods
### clone(result)→Cartesian3
> Duplicates this Cartesian3 instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| result| Cartesian3| optionalThe object onto which to store the result. |

### equals(right)→boolean
> Compares this Cartesian against the provided Cartesian componentwise and returns true if they are equal, false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| right| Cartesian3| optionalThe right hand side Cartesian. |

### equalsEpsilon(right,relativeEpsilon,absoluteEpsilon)→boolean
> Compares this Cartesian against the provided Cartesian componentwise and returns true if they pass an absolute or relative tolerance test, false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| right| Cartesian3| | optionalThe right hand side Cartesian. |
| relativeEpsilon| number| 0| optionalThe relative epsilon tolerance to use for equality testing. |
| absoluteEpsilon| number| relativeEpsilon| optionalThe absolute epsilon tolerance to use for equality testing. |

### toString()→string
> Creates a string representing this Cartesian in the format '(x, y, z)'. 

### staticCesium.Cartesian3.abs(cartesian, result)→Cartesian3
> Computes the absolute value of the provided Cartesian. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The Cartesian whose absolute value is to be computed. |
| result| Cartesian3| The object onto which to store the result. |

### staticCesium.Cartesian3.add(left, right, result)→Cartesian3
> Computes the componentwise sum of two Cartesians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartesian3| The first Cartesian. |
| right| Cartesian3| The second Cartesian. |
| result| Cartesian3| The object onto which to store the result. |

### staticCesium.Cartesian3.angleBetween(left, right)→number
> Returns the angle, in radians, between the provided Cartesians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartesian3| The first Cartesian. |
| right| Cartesian3| The second Cartesian. |

### staticCesium.Cartesian3.clamp(value, min, max, result)→Cartesian3
> Constrain a value to lie between two values. 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| Cartesian3| The value to clamp. |
| min| Cartesian3| The minimum bound. |
| max| Cartesian3| The maximum bound. |
| result| Cartesian3| The object into which to store the result. |

### staticCesium.Cartesian3.clone(cartesian,result)→Cartesian3
> Duplicates a Cartesian3 instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The Cartesian to duplicate. |
| result| Cartesian3| optionalThe object onto which to store the result. |

### staticCesium.Cartesian3.cross(left, right, result)→Cartesian3
> Computes the cross (outer) product of two Cartesians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartesian3| The first Cartesian. |
| right| Cartesian3| The second Cartesian. |
| result| Cartesian3| The object onto which to store the result. |

### staticCesium.Cartesian3.distance(left, right)→number
> Computes the distance between two points. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartesian3| The first point to compute the distance from. |
| right| Cartesian3| The second point to compute the distance to. |

### staticCesium.Cartesian3.distanceSquared(left, right)→number
> Computes the squared distance between two points.  Comparing squared distances
using this function is more efficient than comparing distances using Cartesian3#distance . 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartesian3| The first point to compute the distance from. |
| right| Cartesian3| The second point to compute the distance to. |

### staticCesium.Cartesian3.divideByScalar(cartesian, scalar, result)→Cartesian3
> Divides the provided Cartesian componentwise by the provided scalar. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The Cartesian to be divided. |
| scalar| number| The scalar to divide by. |
| result| Cartesian3| The object onto which to store the result. |

### staticCesium.Cartesian3.divideComponents(left, right, result)→Cartesian3
> Computes the componentwise quotient of two Cartesians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartesian3| The first Cartesian. |
| right| Cartesian3| The second Cartesian. |
| result| Cartesian3| The object onto which to store the result. |

### staticCesium.Cartesian3.dot(left, right)→number
> Computes the dot (scalar) product of two Cartesians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartesian3| The first Cartesian. |
| right| Cartesian3| The second Cartesian. |

### staticCesium.Cartesian3.equals(left,right)→boolean
> Compares the provided Cartesians componentwise and returns true if they are equal, false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartesian3| optionalThe first Cartesian. |
| right| Cartesian3| optionalThe second Cartesian. |

### staticCesium.Cartesian3.equalsEpsilon(left,right,relativeEpsilon,absoluteEpsilon)→boolean
> Compares the provided Cartesians componentwise and returns true if they pass an absolute or relative tolerance test, false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartesian3| | optionalThe first Cartesian. |
| right| Cartesian3| | optionalThe second Cartesian. |
| relativeEpsilon| number| 0| optionalThe relative epsilon tolerance to use for equality testing. |
| absoluteEpsilon| number| relativeEpsilon| optionalThe absolute epsilon tolerance to use for equality testing. |

### staticCesium.Cartesian3.fromArray(array,startingIndex,result)→Cartesian3
> Creates a Cartesian3 from three consecutive elements in an array. 

| Name | Type | Description |
| --- | --- | --- |
 |
| array| Array.<number>| | The array whose three consecutive elements correspond to the x, y, and z components, respectively. |
| startingIndex| number| 0| optionalThe offset into the array of the first element, which corresponds to the x component. |
| result| Cartesian3| | optionalThe object onto which to store the result. |

### staticCesium.Cartesian3.fromCartesian4(cartesian,result)→Cartesian3
> Creates a Cartesian3 instance from an existing Cartesian4.  This simply takes the
x, y, and z properties of the Cartesian4 and drops w. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian4| The Cartesian4 instance to create a Cartesian3 instance from. |
| result| Cartesian3| optionalThe object onto which to store the result. |

### staticCesium.Cartesian3.fromDegrees(longitude, latitude,height,ellipsoid,result)→Cartesian3
> Returns a Cartesian3 position from longitude and latitude values given in degrees. 

| Name | Type | Description |
| --- | --- | --- |
 |
| longitude| number| | The longitude, in degrees |
| latitude| number| | The latitude, in degrees |
| height| number| 0.0| optionalThe height, in meters, above the ellipsoid. |
| ellipsoid| Ellipsoid| Ellipsoid.default| optionalThe ellipsoid on which the position lies. |
| result| Cartesian3| | optionalThe object onto which to store the result. |

### staticCesium.Cartesian3.fromDegreesArray(coordinates,ellipsoid,result)→Array.<Cartesian3>
> Returns an array of Cartesian3 positions given an array of longitude and latitude values given in degrees. 

| Name | Type | Description |
| --- | --- | --- |
 |
| coordinates| Array.<number>| | A list of longitude and latitude values. Values alternate [longitude, latitude, longitude, latitude...]. |
| ellipsoid| Ellipsoid| Ellipsoid.default| optionalThe ellipsoid on which the coordinates lie. |
| result| Array.<Cartesian3>| | optionalAn array of Cartesian3 objects to store the result. |

### staticCesium.Cartesian3.fromDegreesArrayHeights(coordinates,ellipsoid,result)→Array.<Cartesian3>
> Returns an array of Cartesian3 positions given an array of longitude, latitude and height values where longitude and latitude are given in degrees. 

| Name | Type | Description |
| --- | --- | --- |
 |
| coordinates| Array.<number>| | A list of longitude, latitude and height values. Values alternate [longitude, latitude, height, longitude, latitude, height...]. |
| ellipsoid| Ellipsoid| Ellipsoid.default| optionalThe ellipsoid on which the position lies. |
| result| Array.<Cartesian3>| | optionalAn array of Cartesian3 objects to store the result. |

### staticCesium.Cartesian3.fromElements(x, y, z,result)→Cartesian3
> Creates a Cartesian3 instance from x, y and z coordinates. 

| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| The x coordinate. |
| y| number| The y coordinate. |
| z| number| The z coordinate. |
| result| Cartesian3| optionalThe object onto which to store the result. |

### staticCesium.Cartesian3.fromRadians(longitude, latitude,height,ellipsoid,result)→Cartesian3
> Returns a Cartesian3 position from longitude and latitude values given in radians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| longitude| number| | The longitude, in radians |
| latitude| number| | The latitude, in radians |
| height| number| 0.0| optionalThe height, in meters, above the ellipsoid. |
| ellipsoid| Ellipsoid| Ellipsoid.default| optionalThe ellipsoid on which the position lies. |
| result| Cartesian3| | optionalThe object onto which to store the result. |

### staticCesium.Cartesian3.fromRadiansArray(coordinates,ellipsoid,result)→Array.<Cartesian3>
> Returns an array of Cartesian3 positions given an array of longitude and latitude values given in radians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| coordinates| Array.<number>| | A list of longitude and latitude values. Values alternate [longitude, latitude, longitude, latitude...]. |
| ellipsoid| Ellipsoid| Ellipsoid.default| optionalThe ellipsoid on which the coordinates lie. |
| result| Array.<Cartesian3>| | optionalAn array of Cartesian3 objects to store the result. |

### staticCesium.Cartesian3.fromRadiansArrayHeights(coordinates,ellipsoid,result)→Array.<Cartesian3>
> Returns an array of Cartesian3 positions given an array of longitude, latitude and height values where longitude and latitude are given in radians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| coordinates| Array.<number>| | A list of longitude, latitude and height values. Values alternate [longitude, latitude, height, longitude, latitude, height...]. |
| ellipsoid| Ellipsoid| Ellipsoid.default| optionalThe ellipsoid on which the position lies. |
| result| Array.<Cartesian3>| | optionalAn array of Cartesian3 objects to store the result. |

### staticCesium.Cartesian3.fromSpherical(spherical,result)→Cartesian3
> Converts the provided Spherical into Cartesian3 coordinates. 

| Name | Type | Description |
| --- | --- | --- |
 |
| spherical| Spherical| The Spherical to be converted to Cartesian3. |
| result| Cartesian3| optionalThe object onto which to store the result. |

### staticCesium.Cartesian3.lerp(start, end, t, result)→Cartesian3
> Computes the linear interpolation or extrapolation at t using the provided cartesians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| start| Cartesian3| The value corresponding to t at 0.0. |
| end| Cartesian3| The value corresponding to t at 1.0. |
| t| number| The point along t at which to interpolate. |
| result| Cartesian3| The object onto which to store the result. |

### staticCesium.Cartesian3.magnitude(cartesian)→number
> Computes the Cartesian's magnitude (length). 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The Cartesian instance whose magnitude is to be computed. |

### staticCesium.Cartesian3.magnitudeSquared(cartesian)→number
> Computes the provided Cartesian's squared magnitude. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The Cartesian instance whose squared magnitude is to be computed. |

### staticCesium.Cartesian3.maximumByComponent(first, second, result)→Cartesian3
> Compares two Cartesians and computes a Cartesian which contains the maximum components of the supplied Cartesians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| first| Cartesian3| A cartesian to compare. |
| second| Cartesian3| A cartesian to compare. |
| result| Cartesian3| The object into which to store the result. |

### staticCesium.Cartesian3.maximumComponent(cartesian)→number
> Computes the value of the maximum component for the supplied Cartesian. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The cartesian to use. |

### staticCesium.Cartesian3.midpoint(left, right, result)→Cartesian3
> Computes the midpoint between the right and left Cartesian. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartesian3| The first Cartesian. |
| right| Cartesian3| The second Cartesian. |
| result| Cartesian3| The object onto which to store the result. |

### staticCesium.Cartesian3.minimumByComponent(first, second, result)→Cartesian3
> Compares two Cartesians and computes a Cartesian which contains the minimum components of the supplied Cartesians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| first| Cartesian3| A cartesian to compare. |
| second| Cartesian3| A cartesian to compare. |
| result| Cartesian3| The object into which to store the result. |

### staticCesium.Cartesian3.minimumComponent(cartesian)→number
> Computes the value of the minimum component for the supplied Cartesian. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The cartesian to use. |

### staticCesium.Cartesian3.mostOrthogonalAxis(cartesian, result)→Cartesian3
> Returns the axis that is most orthogonal to the provided Cartesian. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The Cartesian on which to find the most orthogonal axis. |
| result| Cartesian3| The object onto which to store the result. |

### staticCesium.Cartesian3.multiplyByScalar(cartesian, scalar, result)→Cartesian3
> Multiplies the provided Cartesian componentwise by the provided scalar. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The Cartesian to be scaled. |
| scalar| number| The scalar to multiply with. |
| result| Cartesian3| The object onto which to store the result. |

### staticCesium.Cartesian3.multiplyComponents(left, right, result)→Cartesian3
> Computes the componentwise product of two Cartesians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartesian3| The first Cartesian. |
| right| Cartesian3| The second Cartesian. |
| result| Cartesian3| The object onto which to store the result. |

### staticCesium.Cartesian3.negate(cartesian, result)→Cartesian3
> Negates the provided Cartesian. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The Cartesian to be negated. |
| result| Cartesian3| The object onto which to store the result. |

### staticCesium.Cartesian3.normalize(cartesian, result)→Cartesian3
> Computes the normalized form of the supplied Cartesian. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| The Cartesian to be normalized. |
| result| Cartesian3| The object onto which to store the result. |

### staticCesium.Cartesian3.pack(value, array,startingIndex)→Array.<number>
> Stores the provided instance into the provided array. 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| Cartesian3| | The value to pack. |
| array| Array.<number>| | The array to pack into. |
| startingIndex| number| 0| optionalThe index into the array at which to start packing the elements. |

### staticCesium.Cartesian3.packArray(array,result)→Array.<number>
> Flattens an array of Cartesian3s into an array of components. 

| Name | Type | Description |
| --- | --- | --- |
 |
| array| Array.<Cartesian3>| The array of cartesians to pack. |
| result| Array.<number>| optionalThe array onto which to store the result. If this is a typed array, it must have array.length * 3 components, else aDeveloperErrorwill be thrown. If it is a regular array, it will be resized to have (array.length * 3) elements. |

### staticCesium.Cartesian3.projectVector(a, b, result)→Cartesian3
> Projects vector a onto vector b 

| Name | Type | Description |
| --- | --- | --- |
 |
| a| Cartesian3| The vector that needs projecting |
| b| Cartesian3| The vector to project onto |
| result| Cartesian3| The result cartesian |

### staticCesium.Cartesian3.subtract(left, right, result)→Cartesian3
> Computes the componentwise difference of two Cartesians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartesian3| The first Cartesian. |
| right| Cartesian3| The second Cartesian. |
| result| Cartesian3| The object onto which to store the result. |

### staticCesium.Cartesian3.unpack(array,startingIndex,result)→Cartesian3
> Retrieves an instance from a packed array. 

| Name | Type | Description |
| --- | --- | --- |
 |
| array| Array.<number>| | The packed array. |
| startingIndex| number| 0| optionalThe starting index of the element to be unpacked. |
| result| Cartesian3| | optionalThe object into which to store the result. |

### staticCesium.Cartesian3.unpackArray(array,result)→Array.<Cartesian3>
> Unpacks an array of cartesian components into an array of Cartesian3s. 

| Name | Type | Description |
| --- | --- | --- |
 |
| array| Array.<number>| The array of components to unpack. |
| result| Array.<Cartesian3>| optionalThe array onto which to store the result. |


---

# Cartographic
### new Cesium.Cartographic(longitude,latitude,height)
> A position defined by longitude, latitude, and height. 

| Name | Type | Description |
| --- | --- | --- |
 |
| longitude| number| 0.0| optionalThe longitude, in radians. |
| latitude| number| 0.0| optionalThe latitude, in radians. |
| height| number| 0.0| optionalThe height, in meters, above the ellipsoid. |

## Members
### staticconstantCesium.Cartographic.ZERO:Cartographic
> An immutable Cartographic instance initialized to (0.0, 0.0, 0.0). 

### height: number
> The height, in meters, above the ellipsoid. 

### latitude: number
> The latitude, in radians. 

### longitude: number
> The longitude, in radians. 

## Methods
### staticCesium.Cartographic.clone(cartographic,result)→Cartographic
> Duplicates a Cartographic instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartographic| Cartographic| The cartographic to duplicate. |
| result| Cartographic| optionalThe object onto which to store the result. |

### staticCesium.Cartographic.equals(left,right)→boolean
> Compares the provided cartographics componentwise and returns true if they are equal, false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartographic| optionalThe first cartographic. |
| right| Cartographic| optionalThe second cartographic. |

### staticCesium.Cartographic.equalsEpsilon(left,right,epsilon)→boolean
> Compares the provided cartographics componentwise and returns true if they are within the provided epsilon, false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Cartographic| | optionalThe first cartographic. |
| right| Cartographic| | optionalThe second cartographic. |
| epsilon| number| 0| optionalThe epsilon to use for equality testing. |

### staticCesium.Cartographic.fromCartesian(cartesian,ellipsoid,result)→Cartographic
> Creates a new Cartographic instance from a Cartesian position. The values in the
resulting object will be in radians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| | The Cartesian position to convert to cartographic representation. |
| ellipsoid| Ellipsoid| Ellipsoid.default| optionalThe ellipsoid on which the position lies. |
| result| Cartographic| | optionalThe object onto which to store the result. |

### staticCesium.Cartographic.fromDegrees(longitude, latitude,height,result)→Cartographic
> Creates a new Cartographic instance from longitude and latitude
specified in degrees.  The values in the resulting object will
be in radians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| longitude| number| | The longitude, in degrees. |
| latitude| number| | The latitude, in degrees. |
| height| number| 0.0| optionalThe height, in meters, above the ellipsoid. |
| result| Cartographic| | optionalThe object onto which to store the result. |

### staticCesium.Cartographic.fromRadians(longitude, latitude,height,result)→Cartographic
> Creates a new Cartographic instance from longitude and latitude
specified in radians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| longitude| number| | The longitude, in radians. |
| latitude| number| | The latitude, in radians. |
| height| number| 0.0| optionalThe height, in meters, above the ellipsoid. |
| result| Cartographic| | optionalThe object onto which to store the result. |

### staticCesium.Cartographic.toCartesian(cartographic,ellipsoid,result)→Cartesian3
> Creates a new Cartesian3 instance from a Cartographic input. The values in the inputted
object should be in radians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartographic| Cartographic| | Input to be converted into a Cartesian3 output. |
| ellipsoid| Ellipsoid| Ellipsoid.default| optionalThe ellipsoid on which the position lies. |
| result| Cartesian3| | optionalThe object onto which to store the result. |

### clone(result)→Cartographic
> Duplicates this instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| result| Cartographic| optionalThe object onto which to store the result. |

### equals(right)→boolean
> Compares the provided against this cartographic componentwise and returns true if they are equal, false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| right| Cartographic| optionalThe second cartographic. |

### equalsEpsilon(right,epsilon)→boolean
> Compares the provided against this cartographic componentwise and returns true if they are within the provided epsilon, false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| right| Cartographic| | optionalThe second cartographic. |
| epsilon| number| 0| optionalThe epsilon to use for equality testing. |

### toString()→string
> Creates a string representing this cartographic in the format '(longitude, latitude, height)'. 


---

# Color
### new Cesium.Color(red,green,blue,alpha)
> A color, specified using red, green, blue, and alpha values,
which range from 0 (no intensity) to 1.0 (full intensity). 

| Name | Type | Description |
| --- | --- | --- |
 |
| red| number| 1.0| optionalThe red component. |
| green| number| 1.0| optionalThe green component. |
| blue| number| 1.0| optionalThe blue component. |
| alpha| number| 1.0| optionalThe alpha component. |

## Members
### staticconstantCesium.Color.ALICEBLUE:Color
> An immutable Color instance initialized to CSS color #F0F8FF 

### staticconstantCesium.Color.ANTIQUEWHITE:Color
> An immutable Color instance initialized to CSS color #FAEBD7 

### staticconstantCesium.Color.AQUA:Color
> An immutable Color instance initialized to CSS color #00FFFF 

### staticconstantCesium.Color.AQUAMARINE:Color
> An immutable Color instance initialized to CSS color #7FFFD4 

### staticconstantCesium.Color.AZURE:Color
> An immutable Color instance initialized to CSS color #F0FFFF 

### staticconstantCesium.Color.BEIGE:Color
> An immutable Color instance initialized to CSS color #F5F5DC 

### staticconstantCesium.Color.BISQUE:Color
> An immutable Color instance initialized to CSS color #FFE4C4 

### staticconstantCesium.Color.BLACK:Color
> An immutable Color instance initialized to CSS color #000000 

### staticconstantCesium.Color.BLANCHEDALMOND:Color
> An immutable Color instance initialized to CSS color #FFEBCD 

### staticconstantCesium.Color.BLUE:Color
> An immutable Color instance initialized to CSS color #0000FF 

### staticconstantCesium.Color.BLUEVIOLET:Color
> An immutable Color instance initialized to CSS color #8A2BE2 

### staticconstantCesium.Color.BROWN:Color
> An immutable Color instance initialized to CSS color #A52A2A 

### staticconstantCesium.Color.BURLYWOOD:Color
> An immutable Color instance initialized to CSS color #DEB887 

### staticconstantCesium.Color.CADETBLUE:Color
> An immutable Color instance initialized to CSS color #5F9EA0 

### staticconstantCesium.Color.CHARTREUSE:Color
> An immutable Color instance initialized to CSS color #7FFF00 

### staticconstantCesium.Color.CHOCOLATE:Color
> An immutable Color instance initialized to CSS color #D2691E 

### staticconstantCesium.Color.CORAL:Color
> An immutable Color instance initialized to CSS color #FF7F50 

### staticconstantCesium.Color.CORNFLOWERBLUE:Color
> An immutable Color instance initialized to CSS color #6495ED 

### staticconstantCesium.Color.CORNSILK:Color
> An immutable Color instance initialized to CSS color #FFF8DC 

### staticconstantCesium.Color.CRIMSON:Color
> An immutable Color instance initialized to CSS color #DC143C 

### staticconstantCesium.Color.CYAN:Color
> An immutable Color instance initialized to CSS color #00FFFF 

### staticconstantCesium.Color.DARKBLUE:Color
> An immutable Color instance initialized to CSS color #00008B 

### staticconstantCesium.Color.DARKCYAN:Color
> An immutable Color instance initialized to CSS color #008B8B 

### staticconstantCesium.Color.DARKGOLDENROD:Color
> An immutable Color instance initialized to CSS color #B8860B 

### staticconstantCesium.Color.DARKGRAY:Color
> An immutable Color instance initialized to CSS color #A9A9A9 

### staticconstantCesium.Color.DARKGREEN:Color
> An immutable Color instance initialized to CSS color #006400 

### staticconstantCesium.Color.DARKGREY:Color
> An immutable Color instance initialized to CSS color #A9A9A9 

### staticconstantCesium.Color.DARKKHAKI:Color
> An immutable Color instance initialized to CSS color #BDB76B 

### staticconstantCesium.Color.DARKMAGENTA:Color
> An immutable Color instance initialized to CSS color #8B008B 

### staticconstantCesium.Color.DARKOLIVEGREEN:Color
> An immutable Color instance initialized to CSS color #556B2F 

### staticconstantCesium.Color.DARKORANGE:Color
> An immutable Color instance initialized to CSS color #FF8C00 

### staticconstantCesium.Color.DARKORCHID:Color
> An immutable Color instance initialized to CSS color #9932CC 

### staticconstantCesium.Color.DARKRED:Color
> An immutable Color instance initialized to CSS color #8B0000 

### staticconstantCesium.Color.DARKSALMON:Color
> An immutable Color instance initialized to CSS color #E9967A 

### staticconstantCesium.Color.DARKSEAGREEN:Color
> An immutable Color instance initialized to CSS color #8FBC8F 

### staticconstantCesium.Color.DARKSLATEBLUE:Color
> An immutable Color instance initialized to CSS color #483D8B 

### staticconstantCesium.Color.DARKSLATEGRAY:Color
> An immutable Color instance initialized to CSS color #2F4F4F 

### staticconstantCesium.Color.DARKSLATEGREY:Color
> An immutable Color instance initialized to CSS color #2F4F4F 

### staticconstantCesium.Color.DARKTURQUOISE:Color
> An immutable Color instance initialized to CSS color #00CED1 

### staticconstantCesium.Color.DARKVIOLET:Color
> An immutable Color instance initialized to CSS color #9400D3 

### staticconstantCesium.Color.DEEPPINK:Color
> An immutable Color instance initialized to CSS color #FF1493 

### staticconstantCesium.Color.DEEPSKYBLUE:Color
> An immutable Color instance initialized to CSS color #00BFFF 

### staticconstantCesium.Color.DIMGRAY:Color
> An immutable Color instance initialized to CSS color #696969 

### staticconstantCesium.Color.DIMGREY:Color
> An immutable Color instance initialized to CSS color #696969 

### staticconstantCesium.Color.DODGERBLUE:Color
> An immutable Color instance initialized to CSS color #1E90FF 

### staticconstantCesium.Color.FIREBRICK:Color
> An immutable Color instance initialized to CSS color #B22222 

### staticconstantCesium.Color.FLORALWHITE:Color
> An immutable Color instance initialized to CSS color #FFFAF0 

### staticconstantCesium.Color.FORESTGREEN:Color
> An immutable Color instance initialized to CSS color #228B22 

### staticconstantCesium.Color.FUCHSIA:Color
> An immutable Color instance initialized to CSS color #FF00FF 

### staticconstantCesium.Color.GAINSBORO:Color
> An immutable Color instance initialized to CSS color #DCDCDC 

### staticconstantCesium.Color.GHOSTWHITE:Color
> An immutable Color instance initialized to CSS color #F8F8FF 

### staticconstantCesium.Color.GOLD:Color
> An immutable Color instance initialized to CSS color #FFD700 

### staticconstantCesium.Color.GOLDENROD:Color
> An immutable Color instance initialized to CSS color #DAA520 

### staticconstantCesium.Color.GRAY:Color
> An immutable Color instance initialized to CSS color #808080 

### staticconstantCesium.Color.GREEN:Color
> An immutable Color instance initialized to CSS color #008000 

### staticconstantCesium.Color.GREENYELLOW:Color
> An immutable Color instance initialized to CSS color #ADFF2F 

### staticconstantCesium.Color.GREY:Color
> An immutable Color instance initialized to CSS color #808080 

### staticconstantCesium.Color.HONEYDEW:Color
> An immutable Color instance initialized to CSS color #F0FFF0 

### staticconstantCesium.Color.HOTPINK:Color
> An immutable Color instance initialized to CSS color #FF69B4 

### staticconstantCesium.Color.INDIANRED:Color
> An immutable Color instance initialized to CSS color #CD5C5C 

### staticconstantCesium.Color.INDIGO:Color
> An immutable Color instance initialized to CSS color #4B0082 

### staticconstantCesium.Color.IVORY:Color
> An immutable Color instance initialized to CSS color #FFFFF0 

### staticconstantCesium.Color.KHAKI:Color
> An immutable Color instance initialized to CSS color #F0E68C 

### staticconstantCesium.Color.LAVENDAR_BLUSH:Color
> An immutable Color instance initialized to CSS color #FFF0F5 

### staticconstantCesium.Color.LAVENDER:Color
> An immutable Color instance initialized to CSS color #E6E6FA 

### staticconstantCesium.Color.LAWNGREEN:Color
> An immutable Color instance initialized to CSS color #7CFC00 

### staticconstantCesium.Color.LEMONCHIFFON:Color
> An immutable Color instance initialized to CSS color #FFFACD 

### staticconstantCesium.Color.LIGHTBLUE:Color
> An immutable Color instance initialized to CSS color #ADD8E6 

### staticconstantCesium.Color.LIGHTCORAL:Color
> An immutable Color instance initialized to CSS color #F08080 

### staticconstantCesium.Color.LIGHTCYAN:Color
> An immutable Color instance initialized to CSS color #E0FFFF 

### staticconstantCesium.Color.LIGHTGOLDENRODYELLOW:Color
> An immutable Color instance initialized to CSS color #FAFAD2 

### staticconstantCesium.Color.LIGHTGRAY:Color
> An immutable Color instance initialized to CSS color #D3D3D3 

### staticconstantCesium.Color.LIGHTGREEN:Color
> An immutable Color instance initialized to CSS color #90EE90 

### staticconstantCesium.Color.LIGHTGREY:Color
> An immutable Color instance initialized to CSS color #D3D3D3 

### staticconstantCesium.Color.LIGHTPINK:Color
> An immutable Color instance initialized to CSS color #FFB6C1 

### staticconstantCesium.Color.LIGHTSEAGREEN:Color
> An immutable Color instance initialized to CSS color #20B2AA 

### staticconstantCesium.Color.LIGHTSKYBLUE:Color
> An immutable Color instance initialized to CSS color #87CEFA 

### staticconstantCesium.Color.LIGHTSLATEGRAY:Color
> An immutable Color instance initialized to CSS color #778899 

### staticconstantCesium.Color.LIGHTSLATEGREY:Color
> An immutable Color instance initialized to CSS color #778899 

### staticconstantCesium.Color.LIGHTSTEELBLUE:Color
> An immutable Color instance initialized to CSS color #B0C4DE 

### staticconstantCesium.Color.LIGHTYELLOW:Color
> An immutable Color instance initialized to CSS color #FFFFE0 

### staticconstantCesium.Color.LIME:Color
> An immutable Color instance initialized to CSS color #00FF00 

### staticconstantCesium.Color.LIMEGREEN:Color
> An immutable Color instance initialized to CSS color #32CD32 

### staticconstantCesium.Color.LINEN:Color
> An immutable Color instance initialized to CSS color #FAF0E6 

### staticconstantCesium.Color.MAGENTA:Color
> An immutable Color instance initialized to CSS color #FF00FF 

### staticconstantCesium.Color.MAROON:Color
> An immutable Color instance initialized to CSS color #800000 

### staticconstantCesium.Color.MEDIUMAQUAMARINE:Color
> An immutable Color instance initialized to CSS color #66CDAA 

### staticconstantCesium.Color.MEDIUMBLUE:Color
> An immutable Color instance initialized to CSS color #0000CD 

### staticconstantCesium.Color.MEDIUMORCHID:Color
> An immutable Color instance initialized to CSS color #BA55D3 

### staticconstantCesium.Color.MEDIUMPURPLE:Color
> An immutable Color instance initialized to CSS color #9370DB 

### staticconstantCesium.Color.MEDIUMSEAGREEN:Color
> An immutable Color instance initialized to CSS color #3CB371 

### staticconstantCesium.Color.MEDIUMSLATEBLUE:Color
> An immutable Color instance initialized to CSS color #7B68EE 

### staticconstantCesium.Color.MEDIUMSPRINGGREEN:Color
> An immutable Color instance initialized to CSS color #00FA9A 

### staticconstantCesium.Color.MEDIUMTURQUOISE:Color
> An immutable Color instance initialized to CSS color #48D1CC 

### staticconstantCesium.Color.MEDIUMVIOLETRED:Color
> An immutable Color instance initialized to CSS color #C71585 

### staticconstantCesium.Color.MIDNIGHTBLUE:Color
> An immutable Color instance initialized to CSS color #191970 

### staticconstantCesium.Color.MINTCREAM:Color
> An immutable Color instance initialized to CSS color #F5FFFA 

### staticconstantCesium.Color.MISTYROSE:Color
> An immutable Color instance initialized to CSS color #FFE4E1 

### staticconstantCesium.Color.MOCCASIN:Color
> An immutable Color instance initialized to CSS color #FFE4B5 

### staticconstantCesium.Color.NAVAJOWHITE:Color
> An immutable Color instance initialized to CSS color #FFDEAD 

### staticconstantCesium.Color.NAVY:Color
> An immutable Color instance initialized to CSS color #000080 

### staticconstantCesium.Color.OLDLACE:Color
> An immutable Color instance initialized to CSS color #FDF5E6 

### staticconstantCesium.Color.OLIVE:Color
> An immutable Color instance initialized to CSS color #808000 

### staticconstantCesium.Color.OLIVEDRAB:Color
> An immutable Color instance initialized to CSS color #6B8E23 

### staticconstantCesium.Color.ORANGE:Color
> An immutable Color instance initialized to CSS color #FFA500 

### staticconstantCesium.Color.ORANGERED:Color
> An immutable Color instance initialized to CSS color #FF4500 

### staticconstantCesium.Color.ORCHID:Color
> An immutable Color instance initialized to CSS color #DA70D6 

### staticCesium.Color.packedLength: number
> The number of elements used to pack the object into an array. 

### staticconstantCesium.Color.PALEGOLDENROD:Color
> An immutable Color instance initialized to CSS color #EEE8AA 

### staticconstantCesium.Color.PALEGREEN:Color
> An immutable Color instance initialized to CSS color #98FB98 

### staticconstantCesium.Color.PALETURQUOISE:Color
> An immutable Color instance initialized to CSS color #AFEEEE 

### staticconstantCesium.Color.PALEVIOLETRED:Color
> An immutable Color instance initialized to CSS color #DB7093 

### staticconstantCesium.Color.PAPAYAWHIP:Color
> An immutable Color instance initialized to CSS color #FFEFD5 

### staticconstantCesium.Color.PEACHPUFF:Color
> An immutable Color instance initialized to CSS color #FFDAB9 

### staticconstantCesium.Color.PERU:Color
> An immutable Color instance initialized to CSS color #CD853F 

### staticconstantCesium.Color.PINK:Color
> An immutable Color instance initialized to CSS color #FFC0CB 

### staticconstantCesium.Color.PLUM:Color
> An immutable Color instance initialized to CSS color #DDA0DD 

### staticconstantCesium.Color.POWDERBLUE:Color
> An immutable Color instance initialized to CSS color #B0E0E6 

### staticconstantCesium.Color.PURPLE:Color
> An immutable Color instance initialized to CSS color #800080 

### staticconstantCesium.Color.RED:Color
> An immutable Color instance initialized to CSS color #FF0000 

### staticconstantCesium.Color.ROSYBROWN:Color
> An immutable Color instance initialized to CSS color #BC8F8F 

### staticconstantCesium.Color.ROYALBLUE:Color
> An immutable Color instance initialized to CSS color #4169E1 

### staticconstantCesium.Color.SADDLEBROWN:Color
> An immutable Color instance initialized to CSS color #8B4513 

### staticconstantCesium.Color.SALMON:Color
> An immutable Color instance initialized to CSS color #FA8072 

### staticconstantCesium.Color.SANDYBROWN:Color
> An immutable Color instance initialized to CSS color #F4A460 

### staticconstantCesium.Color.SEAGREEN:Color
> An immutable Color instance initialized to CSS color #2E8B57 

### staticconstantCesium.Color.SEASHELL:Color
> An immutable Color instance initialized to CSS color #FFF5EE 

### staticconstantCesium.Color.SIENNA:Color
> An immutable Color instance initialized to CSS color #A0522D 

### staticconstantCesium.Color.SILVER:Color
> An immutable Color instance initialized to CSS color #C0C0C0 

### staticconstantCesium.Color.SKYBLUE:Color
> An immutable Color instance initialized to CSS color #87CEEB 

### staticconstantCesium.Color.SLATEBLUE:Color
> An immutable Color instance initialized to CSS color #6A5ACD 

### staticconstantCesium.Color.SLATEGRAY:Color
> An immutable Color instance initialized to CSS color #708090 

### staticconstantCesium.Color.SLATEGREY:Color
> An immutable Color instance initialized to CSS color #708090 

### staticconstantCesium.Color.SNOW:Color
> An immutable Color instance initialized to CSS color #FFFAFA 

### staticconstantCesium.Color.SPRINGGREEN:Color
> An immutable Color instance initialized to CSS color #00FF7F 

### staticconstantCesium.Color.STEELBLUE:Color
> An immutable Color instance initialized to CSS color #4682B4 

### staticconstantCesium.Color.TAN:Color
> An immutable Color instance initialized to CSS color #D2B48C 

### staticconstantCesium.Color.TEAL:Color
> An immutable Color instance initialized to CSS color #008080 

### staticconstantCesium.Color.THISTLE:Color
> An immutable Color instance initialized to CSS color #D8BFD8 

### staticconstantCesium.Color.TOMATO:Color
> An immutable Color instance initialized to CSS color #FF6347 

### staticconstantCesium.Color.TRANSPARENT:Color
> An immutable Color instance initialized to CSS transparent. 

### staticconstantCesium.Color.TURQUOISE:Color
> An immutable Color instance initialized to CSS color #40E0D0 

### staticconstantCesium.Color.VIOLET:Color
> An immutable Color instance initialized to CSS color #EE82EE 

### staticconstantCesium.Color.WHEAT:Color
> An immutable Color instance initialized to CSS color #F5DEB3 

### staticconstantCesium.Color.WHITE:Color
> An immutable Color instance initialized to CSS color #FFFFFF 

### staticconstantCesium.Color.WHITESMOKE:Color
> An immutable Color instance initialized to CSS color #F5F5F5 

### staticconstantCesium.Color.YELLOW:Color
> An immutable Color instance initialized to CSS color #FFFF00 

### staticconstantCesium.Color.YELLOWGREEN:Color
> An immutable Color instance initialized to CSS color #9ACD32 

### alpha: number
> The alpha component. 

### blue: number
> The blue component. 

### green: number
> The green component. 

### red: number
> The red component. 

## Methods
### staticCesium.Color.add(left, right, result)→Color
> Computes the componentwise sum of two Colors. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Color| The first Color. |
| right| Color| The second Color. |
| result| Color| The object onto which to store the result. |

### staticCesium.Color.bytesToRgba()→number
> Converts RGBA values in bytes to a single numeric unsigned 32-bit RGBA value, using the endianness
of the system. 

### staticCesium.Color.byteToFloat(number)→number
> Converts a 'byte' color component in the range of 0 to 255 into
a 'float' color component in the range of 0 to 1.0. 

| Name | Type | Description |
| --- | --- | --- |
 |
| number| number| The number to be converted. |

### staticCesium.Color.clone(color,result)→Color
> Duplicates a Color. 

| Name | Type | Description |
| --- | --- | --- |
 |
| color| Color| The Color to duplicate. |
| result| Color| optionalThe object to store the result in, if undefined a new instance will be created. |

### staticCesium.Color.divide(left, right, result)→Color
> Computes the componentwise quotient of two Colors. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Color| The first Color. |
| right| Color| The second Color. |
| result| Color| The object onto which to store the result. |

### staticCesium.Color.divideByScalar(color, scalar, result)→Color
> Divides the provided Color componentwise by the provided scalar. 

| Name | Type | Description |
| --- | --- | --- |
 |
| color| Color| The Color to be divided. |
| scalar| number| The scalar to divide with. |
| result| Color| The object onto which to store the result. |

### staticCesium.Color.equals(left,right)→boolean
> Returns true if the first Color equals the second color. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Color| optionalThe first Color to compare for equality. |
| right| Color| optionalThe second Color to compare for equality. |

### staticCesium.Color.floatToByte(number)→number
> Converts a 'float' color component in the range of 0 to 1.0 into
a 'byte' color component in the range of 0 to 255. 

| Name | Type | Description |
| --- | --- | --- |
 |
| number| number| The number to be converted. |

### staticCesium.Color.fromAlpha(color, alpha,result)→Color
> Creates a new Color that has the same red, green, and blue components
of the specified color, but with the specified alpha value. 

| Name | Type | Description |
| --- | --- | --- |
 |
| color| Color| The base color |
| alpha| number| The new alpha component. |
| result| Color| optionalThe object onto which to store the result. |

### staticCesium.Color.fromBytes(red,green,blue,alpha,result)→Color
> Creates a new Color specified using red, green, blue, and alpha values
that are in the range of 0 to 255, converting them internally to a range of 0.0 to 1.0. 

| Name | Type | Description |
| --- | --- | --- |
 |
| red| number| 255| optionalThe red component. |
| green| number| 255| optionalThe green component. |
| blue| number| 255| optionalThe blue component. |
| alpha| number| 255| optionalThe alpha component. |
| result| Color| | optionalThe object onto which to store the result. |

### staticCesium.Color.fromCartesian4(cartesian,result)→Color
> Creates a Color instance from a Cartesian4 . x , y , z ,
and w map to red , green , blue , and alpha , respectively. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian4| The source cartesian. |
| result| Color| optionalThe object onto which to store the result. |

### staticCesium.Color.fromCssColorString(color,result)→Color
> Creates a Color instance from a CSS color value. 

| Name | Type | Description |
| --- | --- | --- |
 |
| color| string| The CSS color value in #rgb, #rgba, #rrggbb, #rrggbbaa, rgb(), rgba(), hsl(), or hsla() format. |
| result| Color| optionalThe object to store the result in, if undefined a new instance will be created. |

### staticCesium.Color.fromHsl(hue,saturation,lightness,alpha,result)→Color
> Creates a Color instance from hue, saturation, and lightness. 

| Name | Type | Description |
| --- | --- | --- |
 |
| hue| number| 0| optionalThe hue angle 0...1 |
| saturation| number| 0| optionalThe saturation value 0...1 |
| lightness| number| 0| optionalThe lightness value 0...1 |
| alpha| number| 1.0| optionalThe alpha component 0...1 |
| result| Color| | optionalThe object to store the result in, if undefined a new instance will be created. |

### staticCesium.Color.fromRandom(options,result)→Color
> Creates a random color using the provided options. For reproducible random colors, you should
call CesiumMath#setRandomNumberSeed once at the beginning of your application. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| red| number| | optionalIf specified, the red component to use instead of a randomized value. |
| minimumRed| number| 0.0| optionalThe maximum red value to generate if none was specified. |
| maximumRed| number| 1.0| optionalThe minimum red value to generate if none was specified. |
| green| number| | optionalIf specified, the green component to use instead of a randomized value. |
| minimumGreen| number| 0.0| optionalThe maximum green value to generate if none was specified. |
| maximumGreen| number| 1.0| optionalThe minimum green value to generate if none was specified. |
| blue| number| | optionalIf specified, the blue component to use instead of a randomized value. |
| minimumBlue| number| 0.0| optionalThe maximum blue value to generate if none was specified. |
| maximumBlue| number| 1.0| optionalThe minimum blue value to generate if none was specified. |
| alpha| number| | optionalIf specified, the alpha component to use instead of a randomized value. |
| minimumAlpha| number| 0.0| optionalThe maximum alpha value to generate if none was specified. |
| maximumAlpha| number| 1.0| optionalThe minimum alpha value to generate if none was specified. |

### staticCesium.Color.fromRgba(rgba,result)→Color
> Creates a new Color from a single numeric unsigned 32-bit RGBA value, using the endianness
of the system. 

| Name | Type | Description |
| --- | --- | --- |
 |
| rgba| number| A single numeric unsigned 32-bit RGBA value. |
| result| Color| optionalThe object to store the result in, if undefined a new instance will be created. |

### staticCesium.Color.lerp(start, end, t, result)→Color
> Computes the linear interpolation or extrapolation at t between the provided colors. 

| Name | Type | Description |
| --- | --- | --- |
 |
| start| Color| The color corresponding to t at 0.0. |
| end| Color| The color corresponding to t at 1.0. |
| t| number| The point along t at which to interpolate. |
| result| Color| The object onto which to store the result. |

### staticCesium.Color.mod(left, right, result)→Color
> Computes the componentwise modulus of two Colors. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Color| The first Color. |
| right| Color| The second Color. |
| result| Color| The object onto which to store the result. |

### staticCesium.Color.multiply(left, right, result)→Color
> Computes the componentwise product of two Colors. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Color| The first Color. |
| right| Color| The second Color. |
| result| Color| The object onto which to store the result. |

### staticCesium.Color.multiplyByScalar(color, scalar, result)→Color
> Multiplies the provided Color componentwise by the provided scalar. 

| Name | Type | Description |
| --- | --- | --- |
 |
| color| Color| The Color to be scaled. |
| scalar| number| The scalar to multiply with. |
| result| Color| The object onto which to store the result. |

### staticCesium.Color.pack(value, array,startingIndex)→Array.<number>|TypedArray
> Stores the provided instance into the provided array. 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| Color| | The value to pack. |
| array| Array.<number>\|TypedArray| | The array to pack into. |
| startingIndex| number| 0| optionalThe index into the array at which to start packing the elements. |

### staticCesium.Color.subtract(left, right, result)→Color
> Computes the componentwise difference of two Colors. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| Color| The first Color. |
| right| Color| The second Color. |
| result| Color| The object onto which to store the result. |

### staticCesium.Color.unpack(array,startingIndex,result)→Color
> Retrieves an instance from a packed array. 

| Name | Type | Description |
| --- | --- | --- |
 |
| array| Array.<number>\|TypedArray| | The packed array. |
| startingIndex| number| 0| optionalThe starting index of the element to be unpacked. |
| result| Color| | optionalThe object into which to store the result. |

### brighten(magnitude, result)→Color
> Brightens this color by the provided magnitude. 

| Name | Type | Description |
| --- | --- | --- |
 |
| magnitude| number| A positive number indicating the amount to brighten. |
| result| Color| The object onto which to store the result. |

### clone(result)→Color
> Returns a duplicate of a Color instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| result| Color| optionalThe object to store the result in, if undefined a new instance will be created. |

### darken(magnitude, result)→Color
> Darkens this color by the provided magnitude. 

| Name | Type | Description |
| --- | --- | --- |
 |
| magnitude| number| A positive number indicating the amount to darken. |
| result| Color| The object onto which to store the result. |

### equals(other)→boolean
> Returns true if this Color equals other. 

| Name | Type | Description |
| --- | --- | --- |
 |
| other| Color| optionalThe Color to compare for equality. |

### equalsEpsilon(other,epsilon)→boolean
> Returns true if this Color equals other componentwise within the specified epsilon. 

| Name | Type | Description |
| --- | --- | --- |
 |
| other| Color| | The Color to compare for equality. |
| epsilon| number| 0.0| optionalThe epsilon to use for equality testing. |

### toBytes(result)→Array.<number>
> Converts this color to an array of red, green, blue, and alpha values
that are in the range of 0 to 255. 

| Name | Type | Description |
| --- | --- | --- |
 |
| result| Array.<number>| optionalThe array to store the result in, if undefined a new instance will be created. |

### toCssColorString()→string
> Creates a string containing the CSS color value for this color. 

### toCssHexString()→string
> Creates a string containing CSS hex string color value for this color. 

### toRgba()→number
> Converts this color to a single numeric unsigned 32-bit RGBA value, using the endianness
of the system. 

### toString()→string
> Creates a string representing this Color in the format '(red, green, blue, alpha)'. 

### withAlpha(alpha,result)→Color
> Creates a new Color that has the same red, green, and blue components
as this Color, but with the specified alpha value. 

| Name | Type | Description |
| --- | --- | --- |
 |
| alpha| number| The new alpha component. |
| result| Color| optionalThe object onto which to store the result. |


---

# JulianDate
### new Cesium.JulianDate(julianDayNumber,secondsOfDay,timeStandard)
> Represents an astronomical Julian date, which is the number of days since noon on January 1, -4712 (4713 BC).
For increased precision, this class stores the whole number part of the date and the seconds
part of the date in separate components.  In order to be safe for arithmetic and represent
leap seconds, the date is always stored in the International Atomic Time standard TimeStandard.TAI . 

| Name | Type | Description |
| --- | --- | --- |
 |
| julianDayNumber| number| 0.0| optionalThe Julian Day Number representing the number of whole days.  Fractional days will also be handled correctly. |
| secondsOfDay| number| 0.0| optionalThe number of seconds into the current Julian Day Number.  Fractional seconds, negative seconds and seconds greater than a day will be handled correctly. |
| timeStandard| TimeStandard| TimeStandard.UTC| optionalThe time standard in which the first two parameters are defined. |

## Members
### staticCesium.JulianDate.leapSeconds: Array.<LeapSecond>
> Gets or sets the list of leap seconds used throughout Cesium. 

### dayNumber: number
> Gets or sets the number of whole days. 

### secondsOfDay: number
> Gets or sets the number of seconds into the current day. 

## Methods
### staticCesium.JulianDate.addDays(julianDate, days, result)→JulianDate
> Adds the provided number of days to the provided date instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| julianDate| JulianDate| The date. |
| days| number| The number of days to add or subtract. |
| result| JulianDate| An existing instance to use for the result. |

### staticCesium.JulianDate.addHours(julianDate, hours, result)→JulianDate
> Adds the provided number of hours to the provided date instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| julianDate| JulianDate| The date. |
| hours| number| The number of hours to add or subtract. |
| result| JulianDate| An existing instance to use for the result. |

### staticCesium.JulianDate.addMinutes(julianDate, minutes, result)→JulianDate
> Adds the provided number of minutes to the provided date instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| julianDate| JulianDate| The date. |
| minutes| number| The number of minutes to add or subtract. |
| result| JulianDate| An existing instance to use for the result. |

### staticCesium.JulianDate.addSeconds(julianDate, seconds, result)→JulianDate
> Adds the provided number of seconds to the provided date instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| julianDate| JulianDate| The date. |
| seconds| number| The number of seconds to add or subtract. |
| result| JulianDate| An existing instance to use for the result. |

### staticCesium.JulianDate.clone(julianDate,result)→JulianDate
> Duplicates a JulianDate instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| julianDate| JulianDate| The date to duplicate. |
| result| JulianDate| optionalAn existing instance to use for the result. |

### staticCesium.JulianDate.compare(left, right)→number
> Compares two instances. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| JulianDate| The first instance. |
| right| JulianDate| The second instance. |

### staticCesium.JulianDate.computeTaiMinusUtc(julianDate)→number
> Computes the number of seconds the provided instance is ahead of UTC. 

| Name | Type | Description |
| --- | --- | --- |
 |
| julianDate| JulianDate| The date. |

### staticCesium.JulianDate.daysDifference(left, right)→number
> Computes the difference in days between the provided instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| JulianDate| The first instance. |
| right| JulianDate| The second instance. |

### staticCesium.JulianDate.equals(left,right)→boolean
> Compares two instances and returns true if they are equal, false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| JulianDate| optionalThe first instance. |
| right| JulianDate| optionalThe second instance. |

### staticCesium.JulianDate.equalsEpsilon(left,right,epsilon)→boolean
> Compares two instances and returns true if they are within epsilon seconds of
each other.  That is, in order for the dates to be considered equal (and for
this function to return true ), the absolute value of the difference between them, in
seconds, must be less than epsilon . 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| JulianDate| | optionalThe first instance. |
| right| JulianDate| | optionalThe second instance. |
| epsilon| number| 0| optionalThe maximum number of seconds that should separate the two instances. |

### staticCesium.JulianDate.fromDate(date,result)→JulianDate
> Creates a new instance from a JavaScript Date. 

| Name | Type | Description |
| --- | --- | --- |
 |
| date| Date| A JavaScript Date. |
| result| JulianDate| optionalAn existing instance to use for the result. |

### staticCesium.JulianDate.fromGregorianDate(date,result)→JulianDate
> Creates a new instance from a GregorianDate. 

| Name | Type | Description |
| --- | --- | --- |
 |
| date| GregorianDate| A GregorianDate. |
| result| JulianDate| optionalAn existing instance to use for the result. |

### staticCesium.JulianDate.fromIso8601(iso8601String,result)→JulianDate
> Creates a new instance from a from an ISO 8601 date.
This method is superior to Date.parse because it will handle all valid formats defined by the ISO 8601
specification, including leap seconds and sub-millisecond times, which discarded by most JavaScript implementations. 

| Name | Type | Description |
| --- | --- | --- |
 |
| iso8601String| string| An ISO 8601 date. |
| result| JulianDate| optionalAn existing instance to use for the result. |

### staticCesium.JulianDate.greaterThan(left, right)→boolean
> Compares the provided instances and returns true if left is later than right , false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| JulianDate| The first instance. |
| right| JulianDate| The second instance. |

### staticCesium.JulianDate.greaterThanOrEquals(left, right)→boolean
> Compares the provided instances and returns true if left is later than or equal to right , false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| JulianDate| The first instance. |
| right| JulianDate| The second instance. |

### staticCesium.JulianDate.lessThan(left, right)→boolean
> Compares the provided instances and returns true if left is earlier than right , false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| JulianDate| The first instance. |
| right| JulianDate| The second instance. |

### staticCesium.JulianDate.lessThanOrEquals(left, right)→boolean
> Compares the provided instances and returns true if left is earlier than or equal to right , false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| JulianDate| The first instance. |
| right| JulianDate| The second instance. |

### staticCesium.JulianDate.now(result)→JulianDate
> Creates a new instance that represents the current system time.
This is equivalent to calling JulianDate.fromDate(new Date()); . 

| Name | Type | Description |
| --- | --- | --- |
 |
| result| JulianDate| optionalAn existing instance to use for the result. |

### staticCesium.JulianDate.secondsDifference(left, right)→number
> Computes the difference in seconds between the provided instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| JulianDate| The first instance. |
| right| JulianDate| The second instance. |

### staticCesium.JulianDate.toDate(julianDate)→Date
> Creates a JavaScript Date from the provided instance.
Since JavaScript dates are only accurate to the nearest millisecond and
cannot represent a leap second, consider using JulianDate.toGregorianDate instead.
If the provided JulianDate is during a leap second, the previous second is used. 

| Name | Type | Description |
| --- | --- | --- |
 |
| julianDate| JulianDate| The date to be converted. |

### staticCesium.JulianDate.toGregorianDate(julianDate,result)→GregorianDate
> Creates a GregorianDate from the provided instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| julianDate| JulianDate| The date to be converted. |
| result| GregorianDate| optionalAn existing instance to use for the result. |

### staticCesium.JulianDate.toIso8601(julianDate,precision)→string
> Creates an ISO8601 representation of the provided date. 

| Name | Type | Description |
| --- | --- | --- |
 |
| julianDate| JulianDate| The date to be converted. |
| precision| number| optionalThe number of fractional digits used to represent the seconds component.  By default, the most precise representation is used. |

### staticCesium.JulianDate.totalDays(julianDate)→number
> Computes the total number of whole and fractional days represented by the provided instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| julianDate| JulianDate| The date. |

### clone(result)→JulianDate
> Duplicates this instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| result| JulianDate| optionalAn existing instance to use for the result. |

### equals(right)→boolean
> Compares this and the provided instance and returns true if they are equal, false otherwise. 

| Name | Type | Description |
| --- | --- | --- |
 |
| right| JulianDate| optionalThe second instance. |

### equalsEpsilon(right,epsilon)→boolean
> Compares this and the provided instance and returns true if they are within epsilon seconds of
each other.  That is, in order for the dates to be considered equal (and for
this function to return true ), the absolute value of the difference between them, in
seconds, must be less than epsilon . 

| Name | Type | Description |
| --- | --- | --- |
 |
| right| JulianDate| | optionalThe second instance. |
| epsilon| number| 0| optionalThe maximum number of seconds that should separate the two instances. |

### toString()→string
> Creates a string representing this date in ISO8601 format. 


---

# Math
### Math()
> Math functions. 

## Members
### staticconstantCesium.Math.DEGREES_PER_RADIAN: number
> The number of degrees in a radian. 

### staticconstantCesium.Math.EPSILON1: number
> 0.1 

### staticconstantCesium.Math.EPSILON2: number
> 0.01 

### staticconstantCesium.Math.EPSILON3: number
> 0.001 

### staticconstantCesium.Math.EPSILON4: number
> 0.0001 

### staticconstantCesium.Math.EPSILON5: number
> 0.00001 

### staticconstantCesium.Math.EPSILON6: number
> 0.000001 

### staticconstantCesium.Math.EPSILON7: number
> 0.0000001 

### staticconstantCesium.Math.EPSILON8: number
> 0.00000001 

### staticconstantCesium.Math.EPSILON9: number
> 0.000000001 

### staticconstantCesium.Math.EPSILON10: number
> 0.0000000001 

### staticconstantCesium.Math.EPSILON11: number
> 0.00000000001 

### staticconstantCesium.Math.EPSILON12: number
> 0.000000000001 

### staticconstantCesium.Math.EPSILON13: number
> 0.0000000000001 

### staticconstantCesium.Math.EPSILON14: number
> 0.00000000000001 

### staticconstantCesium.Math.EPSILON15: number
> 0.000000000000001 

### staticconstantCesium.Math.EPSILON16: number
> 0.0000000000000001 

### staticconstantCesium.Math.EPSILON17: number
> 0.00000000000000001 

### staticconstantCesium.Math.EPSILON18: number
> 0.000000000000000001 

### staticconstantCesium.Math.EPSILON19: number
> 0.0000000000000000001 

### staticconstantCesium.Math.EPSILON20: number
> 0.00000000000000000001 

### staticconstantCesium.Math.EPSILON21: number
> 0.000000000000000000001 

### staticconstantCesium.Math.FOUR_GIGABYTES: number
> 4 * 1024 * 1024 * 1024 

### staticconstantCesium.Math.GRAVITATIONALPARAMETER: number
> The gravitational parameter of the Earth in meters cubed
per second squared as defined by the WGS84 model: 3.986004418e14 

### staticconstantCesium.Math.LUNAR_RADIUS: number
> The mean radius of the moon, according to the "Report of the IAU/IAG Working Group on
Cartographic Coordinates and Rotational Elements of the Planets and satellites: 2000",
Celestial Mechanics 82: 83-110, 2002. 

### staticconstantCesium.Math.ONE_OVER_PI: number
> 1/pi 

### staticconstantCesium.Math.ONE_OVER_TWO_PI: number
> 1/2pi 

### staticconstantCesium.Math.PI: number
> pi 

### staticconstantCesium.Math.PI_OVER_FOUR: number
> pi/4 

### staticconstantCesium.Math.PI_OVER_SIX: number
> pi/6 

### staticconstantCesium.Math.PI_OVER_THREE: number
> pi/3 

### staticconstantCesium.Math.PI_OVER_TWO: number
> pi/2 

### staticconstantCesium.Math.RADIANS_PER_ARCSECOND: number
> The number of radians in an arc second. 

### staticconstantCesium.Math.RADIANS_PER_DEGREE: number
> The number of radians in a degree. 

### staticconstantCesium.Math.SIXTY_FOUR_KILOBYTES: number
> 64 * 1024 

### staticconstantCesium.Math.SOLAR_RADIUS: number
> Radius of the sun in meters: 6.955e8 

### staticconstantCesium.Math.THREE_PI_OVER_TWO: number
> 3pi/2 

### staticconstantCesium.Math.TWO_PI: number
> 2pi 

## Methods
### staticCesium.Math.acosClamped(value)→number
> Computes Math.acos(value) , but first clamps value to the range [-1.0, 1.0]
so that the function will never return NaN. 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| number| The value for which to compute acos. |

### staticCesium.Math.asinClamped(value)→number
> Computes Math.asin(value) , but first clamps value to the range [-1.0, 1.0]
so that the function will never return NaN. 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| number| The value for which to compute asin. |

### staticCesium.Math.cbrt(number)→number
> Finds the cube root of a number.
Returns NaN if number is not provided. 

| Name | Type | Description |
| --- | --- | --- |
 |
| number| number| optionalThe number. |

### staticCesium.Math.chordLength(angle, radius)→number
> Finds the chord length between two points given the circle's radius and the angle between the points. 

| Name | Type | Description |
| --- | --- | --- |
 |
| angle| number| The angle between the two points. |
| radius| number| The radius of the circle. |

### staticCesium.Math.clamp(value, min, max)→number
> Constraint a value to lie between two values. 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| number| The value to clamp. |
| min| number| The minimum value. |
| max| number| The maximum value. |

### staticCesium.Math.clampToLatitudeRange(angle)→number
> Convenience function that clamps a latitude value, in radians, to the range [ -Math.PI/2 , Math.PI/2 ).
Useful for sanitizing data before use in objects requiring correct range. 

| Name | Type | Description |
| --- | --- | --- |
 |
| angle| number| The latitude value, in radians, to clamp to the range [-Math.PI/2,Math.PI/2). |

### staticCesium.Math.convertLongitudeRange(angle)→number
> Converts a longitude value, in radians, to the range [ -Math.PI , Math.PI ). 

| Name | Type | Description |
| --- | --- | --- |
 |
| angle| number| The longitude value, in radians, to convert to the range [-Math.PI,Math.PI). |

### staticCesium.Math.cosh(value)→number
> Returns the hyperbolic cosine of a number.
The hyperbolic cosine of value is defined to be
( e x + e -x )/2.0
where e is Euler's number, approximately 2.71828183. Special cases: If the argument is NaN, then the result is NaN. If the argument is infinite, then the result is positive infinity. If the argument is zero, then the result is 1.0. 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| number| The number whose hyperbolic cosine is to be returned. |

### staticCesium.Math.equalsEpsilon(left, right,relativeEpsilon,absoluteEpsilon)→boolean
> Determines if two values are equal using an absolute or relative tolerance test. This is useful
to avoid problems due to roundoff error when comparing floating-point values directly. The values are
first compared using an absolute tolerance test. If that fails, a relative tolerance test is performed.
Use this test if you are unsure of the magnitudes of left and right. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| number| | The first value to compare. |
| right| number| | The other value to compare. |
| relativeEpsilon| number| 0| optionalThe maximum inclusive delta betweenleftandrightfor the relative tolerance test. |
| absoluteEpsilon| number| relativeEpsilon| optionalThe maximum inclusive delta betweenleftandrightfor the absolute tolerance test. |

### staticCesium.Math.factorial(n)→number
> Computes the factorial of the provided number. 

| Name | Type | Description |
| --- | --- | --- |
 |
| n| number| The number whose factorial is to be computed. |

### staticCesium.Math.fastApproximateAtan(x)→number
> Computes a fast approximation of Atan for input in the range [-1, 1].

Based on Michal Drobot's approximation from ShaderFastLibs,
which in turn is based on "Efficient approximations for the arctangent function,"
Rajan, S. Sichun Wang Inkol, R. Joyal, A., May 2006.
Adapted from ShaderFastLibs under MIT License. 

| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| An input number in the range [-1, 1] |

### staticCesium.Math.fastApproximateAtan2(x, y)→number
> Computes a fast approximation of Atan2(x, y) for arbitrary input scalars.

Range reduction math based on nvidia's cg reference implementation: http://developer.download.nvidia.com/cg/atan2.html 

| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| An input number that isn't zero if y is zero. |
| y| number| An input number that isn't zero if x is zero. |

### staticCesium.Math.fromSNorm(value,rangeMaximum)→number
> Converts a SNORM value in the range [0, rangeMaximum] to a scalar in the range [-1.0, 1.0]. 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| number| | SNORM value in the range [0, rangeMaximum] |
| rangeMaximum| number| 255| optionalThe maximum value in the SNORM range, 255 by default. |

### staticCesium.Math.greaterThan(left, right, absoluteEpsilon)→boolean
> Determines if the left value is greater the right value. If the two values are within absoluteEpsilon of each other, they are considered equal and this function returns false. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| number| The first number to compare. |
| right| number| The second number to compare. |
| absoluteEpsilon| number| The absolute epsilon to use in comparison. |

### staticCesium.Math.greaterThanOrEquals(left, right, absoluteEpsilon)→boolean
> Determines if the left value is greater than or equal to the right value. If the two values are within absoluteEpsilon of each other, they are considered equal and this function returns true. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| number| The first number to compare. |
| right| number| The second number to compare. |
| absoluteEpsilon| number| The absolute epsilon to use in comparison. |

### staticCesium.Math.incrementWrap(n,maximumValue,minimumValue)→number
> Increments a number with a wrapping to a minimum value if the number exceeds the maximum value. 

| Name | Type | Description |
| --- | --- | --- |
 |
| n| number| | optionalThe number to be incremented. |
| maximumValue| number| | optionalThe maximum incremented value before rolling over to the minimum value. |
| minimumValue| number| 0.0| optionalThe number reset to after the maximum value has been exceeded. |

### staticCesium.Math.isPowerOfTwo(n)→boolean
> Determines if a non-negative integer is a power of two.
The maximum allowed input is (2^32)-1 due to 32-bit bitwise operator limitation in Javascript. 

| Name | Type | Description |
| --- | --- | --- |
 |
| n| number| The integer to test in the range [0, (2^32)-1]. |

### staticCesium.Math.lerp(p, q, time)→number
> Computes the linear interpolation of two values. 

| Name | Type | Description |
| --- | --- | --- |
 |
| p| number| The start value to interpolate. |
| q| number| The end value to interpolate. |
| time| number| The time of interpolation generally in the range[0.0, 1.0]. |

### staticCesium.Math.lessThan(left, right, absoluteEpsilon)→boolean
> Determines if the left value is less than the right value. If the two values are within absoluteEpsilon of each other, they are considered equal and this function returns false. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| number| The first number to compare. |
| right| number| The second number to compare. |
| absoluteEpsilon| number| The absolute epsilon to use in comparison. |

### staticCesium.Math.lessThanOrEquals(left, right, absoluteEpsilon)→boolean
> Determines if the left value is less than or equal to the right value. If the two values are within absoluteEpsilon of each other, they are considered equal and this function returns true. 

| Name | Type | Description |
| --- | --- | --- |
 |
| left| number| The first number to compare. |
| right| number| The second number to compare. |
| absoluteEpsilon| number| The absolute epsilon to use in comparison. |

### staticCesium.Math.log2(number)→number
> Finds the base 2 logarithm of a number. 

| Name | Type | Description |
| --- | --- | --- |
 |
| number| number| The number. |

### staticCesium.Math.logBase(number, base)→number
> Finds the logarithm of a number to a base. 

| Name | Type | Description |
| --- | --- | --- |
 |
| number| number| The number. |
| base| number| The base. |

### staticCesium.Math.mod(m, n)→number
> The modulo operation that also works for negative dividends. 

| Name | Type | Description |
| --- | --- | --- |
 |
| m| number| The dividend. |
| n| number| The divisor. |

### staticCesium.Math.negativePiToPi(angle)→number
> Produces an angle in the range -Pi < = angle < = Pi which is equivalent to the provided angle. 

| Name | Type | Description |
| --- | --- | --- |
 |
| angle| number| in radians |

### staticCesium.Math.nextPowerOfTwo(n)→number
> Computes the next power-of-two integer greater than or equal to the provided non-negative integer.
The maximum allowed input is 2^31 due to 32-bit bitwise operator limitation in Javascript. 

| Name | Type | Description |
| --- | --- | --- |
 |
| n| number| The integer to test in the range [0, 2^31]. |

### staticCesium.Math.nextRandomNumber()→number
> Generates a random floating point number in the range of [0.0, 1.0)
using a Mersenne twister. 

### staticCesium.Math.normalize(value, rangeMinimum, rangeMaximum)→number
> Converts a scalar value in the range [rangeMinimum, rangeMaximum] to a scalar in the range [0.0, 1.0] 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| number| The scalar value in the range [rangeMinimum, rangeMaximum] |
| rangeMinimum| number| The minimum value in the mapped range. |
| rangeMaximum| number| The maximum value in the mapped range. |

### staticCesium.Math.previousPowerOfTwo(n)→number
> Computes the previous power-of-two integer less than or equal to the provided non-negative integer.
The maximum allowed input is (2^32)-1 due to 32-bit bitwise operator limitation in Javascript. 

| Name | Type | Description |
| --- | --- | --- |
 |
| n| number| The integer to test in the range [0, (2^32)-1]. |

### staticCesium.Math.randomBetween(min, max)→number
> Generates a random number between two numbers. 

| Name | Type | Description |
| --- | --- | --- |
 |
| min| number| The minimum value. |
| max| number| The maximum value. |

### staticCesium.Math.setRandomNumberSeed(seed)
> Sets the seed used by the random number generator
in CesiumMath#nextRandomNumber . 

| Name | Type | Description |
| --- | --- | --- |
 |
| seed| number| An integer used as the seed. |

### staticCesium.Math.sign(value)→number
> Returns the sign of the value; 1 if the value is positive, -1 if the value is
negative, or 0 if the value is 0. 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| number| The value to return the sign of. |

### staticCesium.Math.signNotZero(value)→number
> Returns 1.0 if the given value is positive or zero, and -1.0 if it is negative.
This is similar to CesiumMath#sign except that returns 1.0 instead of
0.0 when the input value is 0.0. 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| number| The value to return the sign of. |

### staticCesium.Math.sinh(value)→number
> Returns the hyperbolic sine of a number.
The hyperbolic sine of value is defined to be
( e x - e -x )/2.0
where e is Euler's number, approximately 2.71828183. Special cases: If the argument is NaN, then the result is NaN. If the argument is infinite, then the result is an infinity
    with the same sign as the argument. If the argument is zero, then the result is a zero with the
    same sign as the argument. 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| number| The number whose hyperbolic sine is to be returned. |

### staticCesium.Math.toDegrees(radians)→number
> Converts radians to degrees. 

| Name | Type | Description |
| --- | --- | --- |
 |
| radians| number| The angle to convert in radians. |

### staticCesium.Math.toRadians(degrees)→number
> Converts degrees to radians. 

| Name | Type | Description |
| --- | --- | --- |
 |
| degrees| number| The angle to convert in degrees. |

### staticCesium.Math.toSNorm(value,rangeMaximum)→number
> Converts a scalar value in the range [-1.0, 1.0] to a SNORM in the range [0, rangeMaximum] 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| number| | The scalar value in the range [-1.0, 1.0] |
| rangeMaximum| number| 255| optionalThe maximum value in the mapped range, 255 by default. |

### staticCesium.Math.zeroToTwoPi(angle)→number
> Produces an angle in the range 0 < = angle < = 2Pi which is equivalent to the provided angle. 

| Name | Type | Description |
| --- | --- | --- |
 |
| angle| number| in radians |


---

# Globe
### new Cesium.Globe(ellipsoid)
> The globe rendered in the scene, including its terrain ( Globe#terrainProvider )
and imagery layers ( Globe#imageryLayers ).  Access the globe using Scene#globe . 

| Name | Type | Description |
| --- | --- | --- |
 |
| ellipsoid| Ellipsoid| Ellipsoid.default| optionalDetermines the size and shape of the globe. |

## Members
### atmosphereBrightnessShift: number
> The brightness shift to apply to the atmosphere. Defaults to 0.0 (no shift).
A brightness shift of -1.0 is complete darkness, which will let space show through. 

### atmosphereHueShift: number
> The hue shift to apply to the atmosphere. Defaults to 0.0 (no shift).
A hue shift of 1.0 indicates a complete rotation of the hues available. 

### atmosphereLightIntensity: number
> The intensity of the light that is used for computing the ground atmosphere color. 

### atmosphereMieAnisotropy: number
> The anisotropy of the medium to consider for Mie scattering. Valid values are between -1.0 and 1.0. 

### atmosphereMieCoefficient:Cartesian3
> The Mie scattering coefficient used in the atmospheric scattering equations for the ground atmosphere. 

### atmosphereMieScaleHeight: number
> The Mie scale height used in the atmospheric scattering equations for the ground atmosphere, in meters. 

### atmosphereRayleighCoefficient:Cartesian3
> The Rayleigh scattering coefficient used in the atmospheric scattering equations for the ground atmosphere. 

### atmosphereRayleighScaleHeight: number
> The Rayleigh scale height used in the atmospheric scattering equations for the ground atmosphere, in meters. 

### atmosphereSaturationShift: number
> The saturation shift to apply to the atmosphere. Defaults to 0.0 (no shift).
A saturation shift of -1.0 is monochrome. 

### backFaceCulling: boolean
> Whether to cull back-facing terrain. Back faces are not culled when the camera is underground or translucency is enabled. 

### baseColor:Color
> Gets or sets the color of the globe when no imagery is available. 

### cartographicLimitRectangle:Rectangle
> A property specifying a Rectangle used to limit globe rendering to a cartographic area.
Defaults to the maximum extent of cartographic coordinates. 

### clippingPlanes:ClippingPlaneCollection
> A property specifying a ClippingPlaneCollection used to selectively disable rendering on the outside of each plane. 

### clippingPolygons:ClippingPolygonCollection
> A property specifying a ClippingPolygonCollection used to selectively disable rendering inside or outside a list of polygons. 

### depthTestAgainstTerrain: boolean
> True if primitives such as billboards, polylines, labels, etc. should be depth-tested
against the terrain surface, or false if such primitives should always be drawn on top
of terrain unless they're on the opposite side of the globe.  The disadvantage of depth
testing primitives against terrain is that slight numerical noise or terrain level-of-detail
switched can sometimes make a primitive that should be on the surface disappear underneath it. 

### dynamicAtmosphereLighting: boolean
> Enable dynamic lighting effects on atmosphere and fog. This only takes effect
when enableLighting is true . 

### dynamicAtmosphereLightingFromSun: boolean
> Whether dynamic atmosphere lighting uses the sun direction instead of the scene's
light direction. This only takes effect when enableLighting and dynamicAtmosphereLighting are true . 

### ellipsoid:Ellipsoid
> Gets an ellipsoid describing the shape of this globe. 

### enableLighting: boolean
> Enable lighting the globe with the scene's light source. 

### fillHighlightColor:Color
> The color to use to highlight terrain fill tiles. If undefined, fill tiles are not
highlighted at all. The alpha value is used to alpha blend with the tile's
actual color. Because terrain fill tiles do not represent the actual terrain surface,
it may be useful in some applications to indicate visually that they are not to be trusted. 

### imageryLayers:ImageryLayerCollection
> Gets the collection of image layers that will be rendered on this globe. 

### readonlyimageryLayersUpdatedEvent:Event
> Gets an event that's raised when an imagery layer is added, shown, hidden, moved, or removed. 

### lambertDiffuseMultiplier: number
> A multiplier to adjust terrain lambert lighting.
This number is multiplied by the result of czm_getLambertDiffuse in GlobeFS.glsl.
This only takes effect when enableLighting is true . 

### lightingFadeInDistance: number
> The distance where lighting resumes. This only takes effect
when enableLighting or showGroundAtmosphere is true . 

### lightingFadeOutDistance: number
> The distance where everything becomes lit. This only takes effect
when enableLighting or showGroundAtmosphere is true . 

### loadingDescendantLimit: number
> Gets or sets the number of loading descendant tiles that is considered "too many".
If a tile has too many loading descendants, that tile will be loaded and rendered before any of
its descendants are loaded and rendered. This means more feedback for the user that something
is happening at the cost of a longer overall load time. Setting this to 0 will cause each
tile level to be loaded successively, significantly increasing load time. Setting it to a large
number (e.g. 1000) will minimize the number of tiles that are loaded but tend to make
detail appear all at once after a long wait. 

### material:Material|undefined
> Gets or sets the material appearance of the Globe.  This can be one of several built-in Material objects or a custom material, scripted with Fabric . 

### maximumScreenSpaceError: number
> The maximum screen-space error used to drive level-of-detail refinement.  Higher
values will provide better performance but lower visual quality. 

### nightFadeInDistance: number
> The distance where the darkness of night from the ground atmosphere fades in to an unlit ground atmosphere.
This only takes effect when showGroundAtmosphere , enableLighting , and dynamicAtmosphereLighting are true . 

### nightFadeOutDistance: number
> The distance where the darkness of night from the ground atmosphere fades out to a lit ground atmosphere.
This only takes effect when showGroundAtmosphere , enableLighting , and dynamicAtmosphereLighting are true . 

### oceanNormalMapUrl: string
> The normal map to use for rendering waves in the ocean.  Setting this property will
only have an effect if the configured terrain provider includes a water mask. 

### preloadAncestors: boolean
> Gets or sets a value indicating whether the ancestors of rendered tiles should be preloaded.
Setting this to true optimizes the zoom-out experience and provides more detail in
newly-exposed areas when panning. The down side is that it requires loading more tiles. 

### preloadSiblings: boolean
> Gets or sets a value indicating whether the siblings of rendered tiles should be preloaded.
Setting this to true causes tiles with the same parent as a rendered tile to be loaded, even
if they are culled. Setting this to true may provide a better panning experience at the
cost of loading more tiles. 

### shadows:ShadowMode
> Determines whether the globe casts or receives shadows from light sources. Setting the globe
to cast shadows may impact performance since the terrain is rendered again from the light's perspective.
Currently only terrain that is in view casts shadows. By default the globe does not cast shadows. 

### show: boolean
> Determines if the globe will be shown. 

### showGroundAtmosphere: boolean
> Enable the ground atmosphere, which is drawn over the globe when viewed from a distance between lightingFadeInDistance and lightingFadeOutDistance . 

### showSkirts: boolean
> Whether to show terrain skirts. Terrain skirts are geometry extending downwards from a tile's edges used to hide seams between neighboring tiles.
Skirts are always hidden when the camera is underground or translucency is enabled. 

### showWaterEffect: boolean
> True if an animated wave effect should be shown in areas of the globe
covered by water; otherwise, false.  This property is ignored if the terrainProvider does not provide a water mask. 

### terrainProvider:TerrainProvider
> The terrain provider providing surface geometry for this globe. 

### readonlyterrainProviderChanged:Event
> Gets an event that's raised when the terrain provider is changed 

### tileCacheSize: number
> The size of the terrain tile cache, expressed as a number of tiles.  Any additional
tiles beyond this number will be freed, as long as they aren't needed for rendering
this frame.  A larger number will consume more memory but will show detail faster
when, for example, zooming out and then back in. 

### tileLoadProgressEvent:Event
> Gets an event that's raised when the length of the tile load queue has changed since the last render frame.  When the load queue is empty,
all terrain and imagery for the current view have been loaded.  The event passes the new length of the tile load queue. 

### readonlytilesLoaded: boolean
> Returns true when the tile load queue is empty, false otherwise.  When the load queue is empty,
all terrain and imagery for the current view have been loaded. 

### translucency:GlobeTranslucency
> Properties for controlling globe translucency. 

### undergroundColor:Color
> The color to render the back side of the globe when the camera is underground or the globe is translucent,
blended with the globe color based on the camera's distance. To disable underground coloring, set undergroundColor to undefined . 

### undergroundColorAlphaByDistance:NearFarScalar
> Gets or sets the near and far distance for blending Globe#undergroundColor with the globe color.
The alpha will interpolate between the NearFarScalar#nearValue and NearFarScalar#farValue while the camera distance falls within the lower and upper bounds
of the specified NearFarScalar#near and NearFarScalar#far .
Outside of these ranges the alpha remains clamped to the nearest bound. If undefined,
the underground color will not be blended with the globe color. When the camera is above the ellipsoid the distance is computed from the nearest
point on the ellipsoid instead of the camera's position. 

### vertexShadowDarkness: number
> Determines the darkness of the vertex shadow.
This only takes effect when enableLighting is true . 

## Methods
### destroy()
> Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
release of WebGL resources, instead of relying on the garbage collector to destroy this object. Once an object is destroyed, it should not be used; calling any function other than isDestroyed will result in a DeveloperError exception.  Therefore,
assign the return value ( undefined ) to the object as done in the example. 

### getHeight(cartographic)→number|undefined
> Get the height of the surface at a given cartographic. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartographic| Cartographic| The cartographic for which to find the height. |

### isDestroyed()→boolean
> Returns true if this object was destroyed; otherwise, false. If this object was destroyed, it should not be used; calling any function other than isDestroyed will result in a DeveloperError exception. 

### pick(ray, scene,result)→Cartesian3|undefined
> Find an intersection between a ray and the globe surface that was rendered. The ray must be given in world coordinates. 

| Name | Type | Description |
| --- | --- | --- |
 |
| ray| Ray| The ray to test for intersection. |
| scene| Scene| The scene. |
| result| Cartesian3| optionalThe object onto which to store the result. |


---

# Scene
### new Cesium.Scene(options)
> The container for all 3D graphical objects and state in a Cesium virtual scene.  Generally,
a scene is not created directly; instead, it is implicitly created by CesiumWidget . 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| Object with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| canvas| HTMLCanvasElement| | The HTML canvas element to create the scene for. |
| contextOptions| ContextOptions| | optionalContext and WebGL creation properties. |
| creditContainer| Element| | optionalThe HTML element in which the credits will be displayed. If not specified, a credit container will be created and added as a sibling of the canvas. |
| creditViewport| Element| | optionalThe HTML element in which to display the credit popup.  If not specified, the viewport will be added as a sibling of the canvas. |
| ellipsoid| Ellipsoid| Ellipsoid.default| optionalThe default ellipsoid. If not specified, the default ellipsoid is used. |
| mapProjection| MapProjection| new GeographicProjection(options.ellipsoid)| optionalThe map projection to use in 2D and Columbus View modes. |
| orderIndependentTranslucency| boolean| true| optionalIf true and the configuration supports it, use order independent translucency. |
| scene3DOnly| boolean| false| optionalIf true, optimizes memory use and performance for 3D mode but disables the ability to use 2D or Columbus View. |
| shadows| boolean| false| optionalDetermines if shadows are cast by light sources. |
| mapMode2D| MapMode2D| MapMode2D.INFINITE_SCROLL| optionalDetermines if the 2D map is rotatable or can be scrolled infinitely in the horizontal direction. |
| requestRenderMode| boolean| false| optionalIf true, rendering a frame will only occur when needed as determined by changes within the scene. Enabling improves performance of the application, but requires usingScene#requestRenderto render a new frame explicitly in this mode. This will be necessary in many cases after making changes to the scene in other parts of the API. SeeImproving Performance with Explicit Rendering. |
| maximumRenderTimeChange| number| 0.0| optionalIf requestRenderMode is true, this value defines the maximum change in simulation time allowed before a render is requested. SeeImproving Performance with Explicit Rendering. |
| depthPlaneEllipsoidOffset| number| 0.0| optionalAdjust the DepthPlane to address rendering artefacts below ellipsoid zero elevation. |
| msaaSamples| number| 4| optionalIf provided, this value controls the rate of multisample antialiasing. Typical multisampling rates are 2, 4, and sometimes 8 samples per pixel. Higher sampling rates of MSAA may impact performance in exchange for improved visual quality. This value only applies to WebGL2 contexts that support multisample render targets. Set to 1 to disable MSAA. |

## Members
### staticCesium.Scene.defaultLogDepthBuffer
> Use this to set the default value for Scene#logarithmicDepthBuffer in newly constructed Scenes
This property relies on fragmentDepth being supported. 

### _enableEdgeVisibility: boolean
> Whether or not to enable edge visibility rendering for 3D tiles.
When enabled, creates a framebuffer with multiple render targets
for advanced edge detection and visibility techniques. 

### atmosphere:Atmosphere
> Settings for atmosphere lighting effects affecting 3D Tiles and model rendering. This is not to be confused with Scene#skyAtmosphere which is responsible for rendering the sky. 

### backgroundColor:Color
> The background color, which is only visible if there is no sky box, i.e., Scene#skyBox is undefined . 

### readonlycamera:Camera
> Gets or sets the camera. 

### readonlycameraUnderground: boolean
> Whether or not the camera is underneath the globe. 

### readonlycanvas: HTMLCanvasElement
> Gets the canvas element to which this scene is bound. 

### readonlyclampToHeightSupported: boolean
> Returns true if the Scene#clampToHeight and Scene#clampToHeightMostDetailed functions are supported. 

### completeMorphOnUserInput: boolean
> Determines whether or not to instantly complete the
scene transition animation on user input. 

### debugCommandFilter: function|undefined
> This property is for debugging only; it is not for production use. A function that determines what commands are executed.  As shown in the examples below,
the function receives the command's owner as an argument, and returns a boolean indicating if the
command should be executed. The default is undefined , indicating that all commands are executed. 

### readonlydebugFrustumStatistics: object|undefined
> This property is for debugging only; it is not for production use. When Scene.debugShowFrustums is true , this contains
properties with statistics about the number of command execute per frustum. totalCommands is the total number of commands executed, ignoring
overlap. commandsInFrustums is an array with the number of times
commands are executed redundantly, e.g., how many commands overlap two or
three frustums. 

### debugShowCommands: boolean
> This property is for debugging only; it is not for production use. When true , commands are randomly shaded.  This is useful
for performance analysis to see what parts of a scene or model are
command-dense and could benefit from batching. 

### debugShowDepthFrustum: number
> This property is for debugging only; it is not for production use. Indicates which frustum will have depth information displayed. 

### debugShowFramesPerSecond: boolean
> This property is for debugging only; it is not for production use. Displays frames per second and time between frames. 

### debugShowFrustumPlanes: boolean
> This property is for debugging only; it is not for production use. When true , draws outlines to show the boundaries of the camera frustums 

### debugShowFrustums: boolean
> This property is for debugging only; it is not for production use. When true , commands are shaded based on the frustums they
overlap.  Commands in the closest frustum are tinted red, commands in
the next closest are green, and commands in the farthest frustum are
blue.  If a command overlaps more than one frustum, the color components
are combined, e.g., a command overlapping the first two frustums is tinted
yellow. 

### readonlydrawingBufferHeight: number
> The drawingBufferHeight of the underlying GL context. 

### readonlydrawingBufferWidth: number
> The drawingBufferWidth of the underlying GL context. 

### readonlyellipsoid:Ellipsoid
> The ellipsoid.  If not specified, the default ellipsoid is used. 

### eyeSeparation: number
> The eye separation distance in meters for use with cardboard or WebVR. 

### farToNearRatio: number
> The far-to-near ratio of the multi-frustum when using a normal depth buffer. This value is used to create the near and far values for each frustum of the multi-frustum. It is only used
when Scene#logarithmicDepthBuffer is false . When logarithmicDepthBuffer is true , use Scene#logarithmicDepthFarToNearRatio . 

### focalLength: number
> The focal length for use when with cardboard or WebVR. 

### fog:Fog
> Blends the atmosphere to geometry far from the camera for horizon views. Allows for additional
performance improvements by rendering less geometry and dispatching less terrain requests.

Disbaled by default if an ellipsoid other than WGS84 is used. 

### gamma: number
> The value used for gamma correction. This is only used when rendering with high dynamic range. 

### globe:Globe
> Gets or sets the depth-test ellipsoid. 

### readonlygroundPrimitives:PrimitiveCollection
> Gets the collection of ground primitives. 

### highDynamicRange: boolean
> Whether or not to use high dynamic range rendering. 

### readonlyhighDynamicRangeSupported: boolean
> Whether or not high dynamic range rendering is supported. 

### readonlyid: string
> Gets the unique identifier for this scene. 

### readonlyimageryLayers:ImageryLayerCollection
> Gets the collection of image layers that will be rendered on the globe. 

### invertClassification: boolean
> When false , 3D Tiles will render normally. When true , classified 3D Tile geometry will render normally and
unclassified 3D Tile geometry will render with the color multiplied by Scene#invertClassificationColor . 

### invertClassificationColor:Color
> The highlight color of unclassified 3D Tile geometry when Scene#invertClassification is true . When the color's alpha is less than 1.0, the unclassified portions of the 3D Tiles will not blend correctly with the classified positions of the 3D Tiles. Also, when the color's alpha is less than 1.0, the WEBGL_depth_texture and EXT_frag_depth WebGL extensions must be supported. 

### readonlyinvertClassificationSupported: boolean
> Returns true if the Scene#invertClassification is supported. 

### readonlylastRenderTime:JulianDate|undefined
> Gets the simulation time when the scene was last rendered. Returns undefined if the scene has not yet been rendered. 

### light:Light
> The light source for shading. Defaults to a directional light from the Sun. 

### logarithmicDepthBuffer: boolean
> Whether or not to use a logarithmic depth buffer. Enabling this option will allow for less frustums in the multi-frustum,
increasing performance. This property relies on fragmentDepth being supported. 

### logarithmicDepthFarToNearRatio: number
> The far-to-near ratio of the multi-frustum when using a logarithmic depth buffer. This value is used to create the near and far values for each frustum of the multi-frustum. It is only used
when Scene#logarithmicDepthBuffer is true . When logarithmicDepthBuffer is false , use Scene#farToNearRatio . 

### readonlymapMode2D:MapMode2D
> Determines if the 2D map is rotatable or can be scrolled infinitely in the horizontal direction. 

### readonlymapProjection:MapProjection
> Get the map projection to use in 2D and Columbus View modes. 

### readonlymaximumAliasedLineWidth: number
> The maximum aliased line width, in pixels, supported by this WebGL implementation.  It will be at least one. 

### readonlymaximumCubeMapSize: number
> The maximum length in pixels of one edge of a cube map, supported by this WebGL implementation.  It will be at least 16. 

### maximumRenderTimeChange: number
> If Scene#requestRenderMode is true , this value defines the maximum change in
simulation time allowed before a render is requested. Lower values increase the number of frames rendered
and higher values decrease the number of frames rendered. If undefined , changes to
the simulation time will never request a render.
This value impacts the rate of rendering for changes in the scene like lighting, entity property updates,
and animations. 

### minimumDisableDepthTestDistance: number
> The distance from the camera at which to disable the depth test of billboards, labels and points
to, for example, prevent clipping against terrain. When set to zero, the depth test should always
be applied. When less than zero, the depth test should never be applied. Setting the disableDepthTestDistance
property of a billboard, label or point will override this value. 

### mode:SceneMode
> Gets or sets the current mode of the scene. 

### moon:Moon|undefined
> The Moon 

### morphComplete:Event
> The event fired at the completion of a scene transition. 

### morphStart:Event
> The event fired at the beginning of a scene transition. 

### morphTime: number
> The current morph transition time between 2D/Columbus View and 3D,
with 0.0 being 2D or Columbus View and 1.0 being 3D. 

### msaaSamples: number
> The sample rate of multisample antialiasing (values greater than 1 enable MSAA). 

### readonlymsaaSupported: boolean
> Returns true if the Scene's context supports MSAA. 

### nearToFarDistance2D: number
> Determines the uniform depth size in meters of each frustum of the multifrustum in 2D. If a primitive or model close
to the surface shows z-fighting, decreasing this will eliminate the artifact, but decrease performance. On the
other hand, increasing this will increase performance but may cause z-fighting among primitives close to the surface. 

### readonlyorderIndependentTranslucency: boolean
> Gets whether or not the scene has order independent translucency enabled.
Note that this only reflects the original construction option, and there are
other factors that could prevent OIT from functioning on a given system configuration. 

### readonlypickPositionSupported: boolean
> Returns true if the Scene#pickPosition function is supported. 

### pickTranslucentDepth: boolean
> When true , enables picking translucent geometry using the depth buffer. Note that Scene#useDepthPicking must also be true for enabling this to work. There is a decrease in performance when enabled. There are extra draw calls to write depth for
translucent geometry. 

### postProcessStages:PostProcessStageCollection
> Post processing effects applied to the final render. 

### readonlypostRender:Event
> Gets the event that will be raised immediately after the scene is rendered.  Subscribers to the event
receive the Scene instance as the first parameter and the current time as the second parameter. 

### readonlypostUpdate:Event
> Gets the event that will be raised immediately after the scene is updated and before the scene is rendered.
Subscribers to the event receive the Scene instance as the first parameter and the current time as the second
parameter. 

### readonlypreRender:Event
> Gets the event that will be raised after the scene is updated and immediately before the scene is rendered.
Subscribers to the event receive the Scene instance as the first parameter and the current time as the second
parameter. 

### readonlypreUpdate:Event
> Gets the event that will be raised before the scene is updated or rendered.  Subscribers to the event
receive the Scene instance as the first parameter and the current time as the second parameter. 

### readonlyprimitives:PrimitiveCollection
> Gets the collection of primitives. 

### readonlyrenderError:Event
> Gets the event that will be raised when an error is thrown inside the render function.
The Scene instance and the thrown error are the only two parameters passed to the event handler.
By default, errors are not rethrown after this event is raised, but that can be changed by setting
the rethrowRenderErrors property. 

### requestRenderMode: boolean
> When true , rendering a frame will only occur when needed as determined by changes within the scene.
Enabling improves performance of the application, but requires using Scene#requestRender to render a new frame explicitly in this mode. This will be necessary in many cases after making changes
to the scene in other parts of the API. 

### rethrowRenderErrors: boolean
> Exceptions occurring in render are always caught in order to raise the renderError event.  If this property is true, the error is rethrown
after the event is raised.  If this property is false, the render function
returns normally after raising the event. 

### readonlysampleHeightSupported: boolean
> Returns true if the Scene#sampleHeight and Scene#sampleHeightMostDetailed functions are supported. 

### readonlyscene3DOnly: boolean
> Gets whether or not the scene is optimized for 3D only viewing. 

### readonlyscreenSpaceCameraController:ScreenSpaceCameraController
> Gets the controller for camera input handling. 

### shadowMap:ShadowMap
> The shadow map for the scene's light source. When enabled, models, primitives, and the globe may cast and receive shadows. 

### skyAtmosphere:SkyAtmosphere|undefined
> The sky atmosphere drawn around the globe. 

### skyBox:SkyBox|undefined
> The SkyBox used to draw the stars. 

### specularEnvironmentMaps: string
> The url to the KTX2 file containing the specular environment map and convoluted mipmaps for image-based lighting of PBR models. 

### readonlyspecularEnvironmentMapsSupported: boolean
> Returns true if specular environment maps are supported. 

### sphericalHarmonicCoefficients: Array.<Cartesian3>
> The spherical harmonic coefficients for image-based lighting of PBR models. 

### splitPosition: number
> Gets or sets the position of the splitter within the viewport.  Valid values are between 0.0 and 1.0. 

### sun:Sun|undefined
> The Sun . 

### sunBloom: boolean
> Uses a bloom filter on the sun when enabled. 

### terrainProvider:TerrainProvider
> The terrain provider providing surface geometry for the globe. 

### readonlyterrainProviderChanged:Event
> Gets an event that's raised when the terrain provider is changed 

### useDepthPicking: boolean
> When true , enables picking using the depth buffer. 

### useWebVR: boolean
> When true , splits the scene into two viewports with steroscopic views for the left and right eyes.
Used for cardboard and WebVR. 

### verticalExaggeration: number
> The vertical exaggeration of the scene.
When set to 1.0, no exaggeration is applied. 

### verticalExaggerationRelativeHeight: number
> The reference height for vertical exaggeration of the scene.
When set to 0.0, the exaggeration is applied relative to the ellipsoid surface. 

## Methods
### cartesianToCanvasCoordinates(position,result)→Cartesian2|undefined
> Transforms a position in cartesian coordinates to canvas coordinates.  This is commonly used to place an
HTML element at the same screen position as an object in the scene. 

| Name | Type | Description |
| --- | --- | --- |
 |
| position| Cartesian3| The position in cartesian coordinates. |
| result| Cartesian2| optionalAn optional object to return the input position transformed to canvas coordinates. |

### clampToHeight(cartesian,objectsToExclude,width,result)→Cartesian3|undefined
> Clamps the given cartesian position to the scene geometry along the geodetic surface normal. Returns the
clamped position or undefined if there was no scene geometry to clamp to. May be used to clamp
objects to the globe, 3D Tiles, or primitives in the scene. This function only clamps to globe tiles and 3D Tiles that are rendered in the current view. Clamps to
all other primitives regardless of their visibility. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesian| Cartesian3| | The cartesian position. |
| objectsToExclude| Array.<object>| | optionalA list of primitives, entities, or 3D Tiles features to not clamp to. |
| width| number| 0.1| optionalWidth of the intersection volume in meters. |
| result| Cartesian3| | optionalAn optional object to return the clamped position. |

### clampToHeightMostDetailed(cartesians,objectsToExclude,width)→Promise.<Array.<(Cartesian3|undefined)>>
> Initiates an asynchronous Scene#clampToHeight query for an array of Cartesian3 positions
using the maximum level of detail for 3D Tilesets in the scene. Returns a promise that is resolved when
the query completes. Each position is modified in place. If a position cannot be clamped because no geometry
can be sampled at that location, or another error occurs, the element in the array is set to undefined. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartesians| Array.<Cartesian3>| | The cartesian positions to update with clamped positions. |
| objectsToExclude| Array.<object>| | optionalA list of primitives, entities, or 3D Tiles features to not clamp to. |
| width| number| 0.1| optionalWidth of the intersection volume in meters. |

### completeMorph()
> Instantly completes an active transition. 

### destroy()
> Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
release of WebGL resources, instead of relying on the garbage collector to destroy this object. Once an object is destroyed, it should not be used; calling any function other than isDestroyed will result in a DeveloperError exception.  Therefore,
assign the return value ( undefined ) to the object as done in the example. 

### drillPick(windowPosition,limit,width,height)→Array.<any>
> Returns a list of objects, each containing a primitive property, for all primitives at
a particular window coordinate position. Other properties may also be set depending on the
type of primitive and may be used to further identify the picked object. The primitives in
the list are ordered by their visual order in the scene (front to back). 

| Name | Type | Description |
| --- | --- | --- |
 |
| windowPosition| Cartesian2| | Window coordinates to perform picking on. |
| limit| number| | optionalIf supplied, stop drilling after collecting this many picks. |
| width| number| 3| optionalWidth of the pick rectangle. |
| height| number| 3| optionalHeight of the pick rectangle. |

### getCompressedTextureFormatSupported(format)→boolean
> Determines if a compressed texture format is supported. 

| Name | Type | Description |
| --- | --- | --- |
 |
| format| string| The texture format. May be the name of the format or the WebGL extension name, e.g. s3tc or WEBGL_compressed_texture_s3tc. |

### isDestroyed()→boolean
> Returns true if this object was destroyed; otherwise, false. If this object was destroyed, it should not be used; calling any function other than isDestroyed will result in a DeveloperError exception. 

### morphTo2D(duration)
> Asynchronously transitions the scene to 2D. 

| Name | Type | Description |
| --- | --- | --- |
 |
| duration| number| 2.0| optionalThe amount of time, in seconds, for transition animations to complete. |

### morphTo3D(duration)
> Asynchronously transitions the scene to 3D. 

| Name | Type | Description |
| --- | --- | --- |
 |
| duration| number| 2.0| optionalThe amount of time, in seconds, for transition animations to complete. |

### morphToColumbusView(duration)
> Asynchronously transitions the scene to Columbus View. 

| Name | Type | Description |
| --- | --- | --- |
 |
| duration| number| 2.0| optionalThe amount of time, in seconds, for transition animations to complete. |

### pick(windowPosition,width,height)→object|undefined
> Returns an object with a primitive property that contains the first (top) primitive in the scene
at a particular window coordinate or undefined if nothing is at the location. Other properties may
potentially be set depending on the type of primitive and may be used to further identify the picked object. When a feature of a 3D Tiles tileset is picked, pick returns a Cesium3DTileFeature object. 

| Name | Type | Description |
| --- | --- | --- |
 |
| windowPosition| Cartesian2| | Window coordinates to perform picking on. |
| width| number| 3| optionalWidth of the pick rectangle. |
| height| number| 3| optionalHeight of the pick rectangle. |

### pickAsync(windowPosition,width,height)→Promise.<(Object|undefined)>
> Performs the same operation as Scene.pick but asynchonosly without blocking the main render thread.
Requires WebGL2 else using fallback. 

| Name | Type | Description |
| --- | --- | --- |
 |
| windowPosition| Cartesian2| | Window coordinates to perform picking on. |
| width| number| 3| optionalWidth of the pick rectangle. |
| height| number| 3| optionalHeight of the pick rectangle. |

### pickMetadata(windowPosition, schemaId, className, propertyName)→MetadataValue|undefined
> Pick a metadata value at the given window position. 

| Name | Type | Description |
| --- | --- | --- |
 |
| windowPosition| Cartesian2| Window coordinates to perform picking on. |
| schemaId| string\|undefined| The ID of the metadata schema to pick values from. If this isundefined, then it will pick the values from the object that match the given class- and property name, regardless of the schema ID. |
| className| string| The name of the metadata class to pick values from |
| propertyName| string| The name of the metadata property to pick values from |

### pickMetadataSchema(windowPosition)→MetadataSchema|undefined
> Pick the schema of the metadata of the object at the given position 

| Name | Type | Description |
| --- | --- | --- |
 |
| windowPosition| Cartesian2| Window coordinates to perform picking on. |

### pickPosition(windowPosition,result)→Cartesian3
> Returns the cartesian position reconstructed from the depth buffer and window position. The position reconstructed from the depth buffer in 2D may be slightly different from those
reconstructed in 3D and Columbus view. This is caused by the difference in the distribution
of depth values of perspective and orthographic projection. Set Scene#pickTranslucentDepth to true to include the depth of
translucent primitives; otherwise, this essentially picks through translucent primitives. 

| Name | Type | Description |
| --- | --- | --- |
 |
| windowPosition| Cartesian2| Window coordinates to perform picking on. |
| result| Cartesian3| optionalThe object on which to restore the result. |

### pickVoxel(windowPosition,width,height)→VoxelCell|undefined
> Returns a VoxelCell for the voxel sample rendered at a particular window coordinate,
or undefined if no voxel is rendered at that position. 

| Name | Type | Description |
| --- | --- | --- |
 |
| windowPosition| Cartesian2| | Window coordinates to perform picking on. |
| width| number| 3| optionalWidth of the pick rectangle. |
| height| number| 3| optionalHeight of the pick rectangle. |

### render(time)
> Update and render the scene. It is usually not necessary to call this function
directly because CesiumWidget will do it automatically. 

| Name | Type | Description |
| --- | --- | --- |
 |
| time| JulianDate| optionalThe simulation time at which to render. |

### requestRender()
> Requests a new rendered frame when Scene#requestRenderMode is set to true .
The render rate will not exceed the CesiumWidget#targetFrameRate . 

### sampleHeight(position,objectsToExclude,width)→number|undefined
> Returns the height of scene geometry at the given cartographic position or undefined if there was no
scene geometry to sample height from. The height of the input position is ignored. May be used to clamp objects to
the globe, 3D Tiles, or primitives in the scene. This function only samples height from globe tiles and 3D Tiles that are rendered in the current view. Samples height
from all other primitives regardless of their visibility. 

| Name | Type | Description |
| --- | --- | --- |
 |
| position| Cartographic| | The cartographic position to sample height from. |
| objectsToExclude| Array.<object>| | optionalA list of primitives, entities, or 3D Tiles features to not sample height from. |
| width| number| 0.1| optionalWidth of the intersection volume in meters. |

### sampleHeightMostDetailed(positions,objectsToExclude,width)→Promise.<Array.<(Cartographic|undefined)>>
> Initiates an asynchronous Scene#sampleHeight query for an array of Cartographic positions
using the maximum level of detail for 3D Tilesets in the scene. The height of the input positions is ignored.
Returns a promise that is resolved when the query completes. Each point height is modified in place.
If a height cannot be determined because no geometry can be sampled at that location, or another error occurs,
the height is set to undefined . 

| Name | Type | Description |
| --- | --- | --- |
 |
| positions| Array.<Cartographic>| | The cartographic positions to update with sampled heights. |
| objectsToExclude| Array.<object>| | optionalA list of primitives, entities, or 3D Tiles features to not sample height from. |
| width| number| 0.1| optionalWidth of the intersection volume in meters. |

### setTerrain(terrain)→Terrain
> Update the terrain providing surface geometry for the globe. 

| Name | Type | Description |
| --- | --- | --- |
 |
| terrain| Terrain| The terrain provider async helper |


---

# Cesium3DTileset
### new Cesium.Cesium3DTileset(options)
> A 3D Tiles tileset ,
used for streaming massive heterogeneous 3D geospatial datasets. This object is normally not instantiated directly, use Cesium3DTileset.fromUrl . 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| Cesium3DTileset.ConstructorOptions| An object describing initialization options |

## Members
### allTilesLoaded:Event
> The event fired to indicate that all tiles that meet the screen space error this frame are loaded. The tileset
is completely loaded for this view. This event is fired at the end of the frame after the scene is rendered. 

### readonlyasset: object
> Gets the tileset's asset object property, which contains metadata about the tileset. See the asset schema reference in the 3D Tiles spec for the full set of properties. 

### backFaceCulling: boolean
> Whether to cull back-facing geometry. When true, back face culling is determined
by the glTF material's doubleSided property; when false, back face culling is disabled. 

### readonlydeprecatedbasePath: string
> The base path that non-absolute paths in tileset JSON file are relative to. 

### baseScreenSpaceError: number
> The screen space error that must be reached before skipping levels of detail. Only used when Cesium3DTileset#skipLevelOfDetail is true . 

### readonlyboundingSphere:BoundingSphere
> The tileset's bounding sphere. 

### cacheBytes: number
> The amount of GPU memory (in bytes) used to cache tiles. This memory usage is estimated from
geometry, textures, and batch table textures of loaded tiles. For point clouds, this value also
includes per-point metadata. Tiles not in view are unloaded to enforce this. If decreasing this value results in unloading tiles, the tiles are unloaded the next frame. If tiles sized more than cacheBytes are needed to meet the
desired screen space error, determined by Cesium3DTileset#maximumScreenSpaceError ,
for the current view, then the memory usage of the tiles loaded will exceed cacheBytes by up to maximumCacheOverflowBytes .
For example, if cacheBytes is 500000, but 600000 bytes
of tiles are needed to meet the screen space error, then 600000 bytes of tiles
may be loaded (if maximumCacheOverflowBytes is at least 100000).
When these tiles go out of view, they will be unloaded. 

### readonlyclassificationType:ClassificationType
> Determines whether terrain, 3D Tiles, or both will be classified by this tileset. This option is only applied to tilesets containing batched 3D models,
glTF content, geometry data, or vector data. Even when undefined, vector
and geometry data must render as classifications and will default to
rendering on both terrain and other 3D Tiles tilesets. When enabled for batched 3D model and glTF tilesets, there are a few
requirements/limitations on the glTF: The glTF cannot contain morph targets, skins, or animations. The glTF cannot contain the EXT_mesh_gpu_instancing extension. Only meshes with TRIANGLES can be used to classify other assets. The meshes must be watertight. The POSITION semantic is required. If _BATCHID s and an index buffer are both present, all indices with the same batch id must occupy contiguous sections of the index buffer. If _BATCHID s are present with no index buffer, all positions with the same batch id must occupy contiguous sections of the position buffer. Additionally, classification is not supported for points or instanced 3D
models. The 3D Tiles or terrain receiving the classification must be opaque. 

### clippingPlanes:ClippingPlaneCollection
> The ClippingPlaneCollection used to selectively disable rendering the tileset. 

### clippingPolygons:ClippingPolygonCollection
> The ClippingPolygonCollection used to selectively disable rendering the tileset. 

### colorBlendAmount: number
> Defines the value used to linearly interpolate between the source color and feature color when the Cesium3DTileset#colorBlendMode is MIX .
A value of 0.0 results in the source color while a value of 1.0 results in the feature color, with any value in-between
resulting in a mix of the source color and feature color. 

### colorBlendMode:Cesium3DTileColorBlendMode
> Defines how per-feature colors set from the Cesium API or declarative styling blend with the source colors from
the original feature, e.g. glTF material or per-point color in the tile. 

### cullRequestsWhileMoving: boolean
> Optimization option. Don't request tiles that will likely be unused when they come back because of the camera's movement. This optimization only applies to stationary tilesets. 

### cullRequestsWhileMovingMultiplier: number
> Optimization option. Multiplier used in culling requests while moving. Larger is more aggressive culling, smaller less aggressive culling. 

### customShader:CustomShader|undefined
> A custom shader to apply to all tiles in the tileset. Only used for
contents that use Model . Using custom shaders with a Cesium3DTileStyle may lead to undefined behavior. 

### debugColorizeTiles: boolean
> This property is for debugging only; it is not optimized for production use. When true, assigns a random color to each tile.  This is useful for visualizing
what features belong to what tiles, especially with additive refinement where features
from parent tiles may be interleaved with features from child tiles. 

### debugFreezeFrame: boolean
> This property is for debugging only; it is not optimized for production use. Determines if only the tiles from last frame should be used for rendering.  This
effectively "freezes" the tileset to the previous frame so it is possible to zoom
out and see what was rendered. 

### debugShowBoundingVolume: boolean
> This property is for debugging only; it is not optimized for production use. When true, renders the bounding volume for each visible tile.  The bounding volume is
white if the tile has a content bounding volume or is empty; otherwise, it is red.  Tiles that don't meet the
screen space error and are still refining to their descendants are yellow. 

### debugShowContentBoundingVolume: boolean
> This property is for debugging only; it is not optimized for production use. When true, renders the bounding volume for each visible tile's content. The bounding volume is
blue if the tile has a content bounding volume; otherwise it is red. 

### debugShowGeometricError: boolean
> This property is for debugging only; it is not optimized for production use. When true, draws labels to indicate the geometric error of each tile. 

### debugShowMemoryUsage: boolean
> This property is for debugging only; it is not optimized for production use. When true, draws labels to indicate the geometry and texture memory usage of each tile. 

### debugShowRenderingStatistics: boolean
> This property is for debugging only; it is not optimized for production use. When true, draws labels to indicate the number of commands, points, triangles and features of each tile. 

### debugShowUrl: boolean
> This property is for debugging only; it is not optimized for production use. When true, draws labels to indicate the url of each tile. 

### debugShowViewerRequestVolume: boolean
> This property is for debugging only; it is not optimized for production use. When true, renders the viewer request volume for each tile. 

### debugWireframe: boolean
> This property is for debugging only; it is not optimized for production use. When true, renders each tile's content as a wireframe. 

### dynamicScreenSpaceError: boolean
> Optimization option. For street-level horizon views, use lower resolution tiles far from the camera. This reduces
the amount of data loaded and improves tileset loading time with a slight drop in visual quality in the distance. This optimization is strongest when the camera is close to the ground plane of the tileset and looking at the
horizon. Furthermore, the results are more accurate for tightly fitting bounding volumes like box and region. 

### dynamicScreenSpaceErrorDensity: number
> Similar to Fog#density , this option controls the camera distance at which the Cesium3DTileset#dynamicScreenSpaceError optimization applies. Larger values will cause tiles closer to the camera to be affected. This value must be
non-negative. This optimization works by rolling off the tile screen space error (SSE) with camera distance like a bell curve.
This has the effect of selecting lower resolution tiles far from the camera. Near the camera, no adjustment is
made. For tiles further away, the SSE is reduced by up to Cesium3DTileset#dynamicScreenSpaceErrorFactor (measured in pixels of error). Increasing the density makes the bell curve narrower so tiles closer to the camera are affected. This is analagous
to moving fog closer to the camera. When the density is 0, the optimization will have no effect on the tileset. 

### dynamicScreenSpaceErrorFactor: number
> A parameter that controls the intensity of the Cesium3DTileset#dynamicScreenSpaceError optimization for
tiles on the horizon. Larger values cause lower resolution tiles to load, improving runtime performance at a slight
reduction of visual quality. The value must be non-negative. More specifically, this parameter represents the maximum adjustment to screen space error (SSE) in pixels for tiles
far away from the camera. See Cesium3DTileset#dynamicScreenSpaceErrorDensity for more details about how
this optimization works. When the SSE factor is set to 0, the optimization will have no effect on the tileset. 

### dynamicScreenSpaceErrorHeightFalloff: number
> A ratio of the tileset's height that determines "street level" for the Cesium3DTileset#dynamicScreenSpaceError optimization. When the camera is below this height, the dynamic screen space error optimization will have the maximum
effect, and it will roll off above this value. Valid values are between 0.0 and 1.0. 

### readonlyellipsoid:Ellipsoid
> Gets an ellipsoid describing the shape of the globe. 

### enableCollision: boolean
> If true , allows collisions for camera collisions or picking. While this is true the camera will be prevented from going in or below the tileset surface if ScreenSpaceCameraController#enableCollisionDetection is true. This can have performance implecations if the tileset contains tile with a larger number of vertices. 

### readonlyenvironmentMapManager:DynamicEnvironmentMapManager
> The properties for managing dynamic environment maps on this model. Affects lighting. 

### examineVectorLinesFunction: function
> Function for examining vector lines as they are being streamed. 

### readonlyextensions: object
> Gets the tileset's extensions object property. 

### readonlyextras: *
> Returns the extras property at the top-level of the tileset JSON, which contains application specific metadata.
Returns undefined if extras does not exist. 

### featureIdLabel: string
> Label of the feature ID set to use for picking and styling. For EXT_mesh_features, this is the feature ID's label property, or
"featureId_N" (where N is the index in the featureIds array) when not
specified. EXT_feature_metadata did not have a label field, so such
feature ID sets are always labeled "featureId_N" where N is the index in
the list of all feature Ids, where feature ID attributes are listed before
feature ID textures. If featureIdLabel is set to an integer N, it is converted to
the string "featureId_N" automatically. If both per-primitive and
per-instance feature IDs are present, the instance feature IDs take
priority. 

### foveatedConeSize: number
> Optimization option. Used when Cesium3DTileset#foveatedScreenSpaceError is true to control the cone size that determines which tiles are deferred.
Tiles that are inside this cone are loaded immediately. Tiles outside the cone are potentially deferred based on how far outside the cone they are and Cesium3DTileset#foveatedInterpolationCallback and Cesium3DTileset#foveatedMinimumScreenSpaceErrorRelaxation .
Setting this to 0.0 means the cone will be the line formed by the camera position and its view direction. Setting this to 1.0 means the cone encompasses the entire field of view of the camera, essentially disabling the effect. 

### foveatedInterpolationCallback:Cesium3DTileset.foveatedInterpolationCallback
> Gets or sets a callback to control how much to raise the screen space error for tiles outside the foveated cone,
interpolating between Cesium3DTileset#foveatedMinimumScreenSpaceErrorRelaxation and Cesium3DTileset#maximumScreenSpaceError . 

### foveatedMinimumScreenSpaceErrorRelaxation: number
> Optimization option. Used when Cesium3DTileset#foveatedScreenSpaceError is true to control the starting screen space error relaxation for tiles outside the foveated cone.
The screen space error will be raised starting with this value up to Cesium3DTileset#maximumScreenSpaceError based on the provided Cesium3DTileset#foveatedInterpolationCallback . 

### foveatedScreenSpaceError: boolean
> Optimization option. Prioritize loading tiles in the center of the screen by temporarily raising the
screen space error for tiles around the edge of the screen. Screen space error returns to normal once all
the tiles in the center of the screen as determined by the Cesium3DTileset#foveatedConeSize are loaded. 

### foveatedTimeDelay: number
> Optimization option. Used when Cesium3DTileset#foveatedScreenSpaceError is true to control
how long in seconds to wait after the camera stops moving before deferred tiles start loading in.
This time delay prevents requesting tiles around the edges of the screen when the camera is moving.
Setting this to 0.0 will immediately request all tiles in any given view. 

### readonlyheightReference:HeightReference|undefined
> Specifies if the height is relative to terrain, 3D Tiles, or both. This option is only applied to point features in tilesets containing vector data.
This option requires the Viewer's scene to be passed in through options.scene. 

### imageBasedLighting:ImageBasedLighting
> The properties for managing image-based lighting on this tileset. 

### readonlyimageryLayers:ImageryLayerCollection
> The collection of ImageryLayer objects providing 2D georeferenced
image data that will be rendered over the tileset.

The imagery will be draped over glTF, B3DM, PNTS, or GeoJSON tile content. 

### immediatelyLoadDesiredLevelOfDetail: boolean
> When true, only tiles that meet the maximum screen space error will ever be downloaded.
Skipping factors are ignored and just the desired tiles are loaded. Only used when Cesium3DTileset#skipLevelOfDetail is true . 

### initialTilesLoaded:Event
> The event fired to indicate that all tiles that meet the screen space error this frame are loaded. This event
is fired once when all tiles in the initial view are loaded. This event is fired at the end of the frame after the scene is rendered. 

### instanceFeatureIdLabel: string
> Label of the instance feature ID set used for picking and styling. If instanceFeatureIdLabel is set to an integer N, it is converted to
the string "instanceFeatureId_N" automatically.
If both per-primitive and per-instance feature IDs are present, the
instance feature IDs take priority. 

### lightColor:Cartesian3
> The light color when shading models. When undefined the scene's light color is used instead. For example, disabling additional light sources by setting tileset.imageBasedLighting.imageBasedLightingFactor = new Cartesian2(0.0, 0.0) will make the tileset much darker. Here, increasing the intensity of the light source will make the tileset brighter. 

### loadProgress:Event
> The event fired to indicate progress of loading new tiles.  This event is fired when a new tile
is requested, when a requested tile is finished downloading, and when a downloaded tile has been
processed and is ready to render. The number of pending tile requests, numberOfPendingRequests , and number of tiles
processing, numberOfTilesProcessing are passed to the event listener. This event is fired at the end of the frame after the scene is rendered. 

### loadSiblings: boolean
> Determines whether siblings of visible tiles are always downloaded during traversal.
This may be useful for ensuring that tiles are already available when the viewer turns left/right. Only used when Cesium3DTileset#skipLevelOfDetail is true . 

### maximumCacheOverflowBytes: number
> The maximum additional amount of GPU memory (in bytes) that will be used to cache tiles. If tiles sized more than cacheBytes plus maximumCacheOverflowBytes are needed to meet the desired screen space error, determined by Cesium3DTileset#maximumScreenSpaceError for the current view, then Cesium3DTileset#memoryAdjustedScreenSpaceError will be adjusted
until the tiles required to meet the adjusted screen space error use less
than cacheBytes plus maximumCacheOverflowBytes . 

### maximumScreenSpaceError: number
> The maximum screen space error used to drive level of detail refinement.  This value helps determine when a tile
refines to its descendants, and therefore plays a major role in balancing performance with visual quality. A tile's screen space error is roughly equivalent to the number of pixels wide that would be drawn if a sphere with a
radius equal to the tile's geometric error were rendered at the tile's position. If this value exceeds maximumScreenSpaceError the tile refines to its descendants. Depending on the tileset, maximumScreenSpaceError may need to be tweaked to achieve the right balance.
Higher values provide better performance but lower visual quality. 

### modelMatrix:Matrix4
> A 4x4 transformation matrix that transforms the entire tileset. 

### outlineColor:Color
> The color to use when rendering outlines. 

### pointCloudShading:PointCloudShading
> Options for controlling point size based on geometric error and eye dome lighting. 

### preferLeaves: boolean
> Optimization option. Prefer loading of leaves first. 

### preloadFlightDestinations: boolean
> Optimization option. Fetch tiles at the camera's flight destination while the camera is in flight. 

### preloadWhenHidden: boolean
> Preload tiles when tileset.show is false . Loads tiles as if the tileset is visible but does not render them. 

### progressiveResolutionHeightFraction: number
> Optimization option. If between (0.0, 0.5], tiles at or above the screen space error for the reduced screen resolution of progressiveResolutionHeightFraction*screenHeight will be prioritized first. This can help get a quick layer of tiles down while full resolution tiles continue to load. 

### readonlyproperties: object
> Gets the tileset's properties dictionary object, which contains metadata about per-feature properties. See the properties schema reference in the 3D Tiles spec for the full set of properties. 

### readonlyresource:Resource
> The resource used to fetch the tileset JSON file 

### readonlyroot:Cesium3DTile
> The root tile. 

### shadows:ShadowMode
> Determines whether the tileset casts or receives shadows from light sources. Enabling shadows has a performance impact. A tileset that casts shadows must be rendered twice, once from the camera and again from the light's point of view. Shadows are rendered only when Viewer#shadows is true . 

### show: boolean
> Determines if the tileset will be shown. 

### showCreditsOnScreen: boolean
> Determines whether the credits of the tileset will be displayed on the screen 

### showOutline: boolean
> Whether to display the outline for models using the CESIUM_primitive_outline extension.
When true, outlines are displayed. When false, outlines are not displayed. 

### skipLevelOfDetail: boolean
> Optimization option. Determines if level of detail skipping should be applied during the traversal. The common strategy for replacement-refinement traversal is to store all levels of the tree in memory and require
all children to be loaded before the parent can refine. With this optimization levels of the tree can be skipped
entirely and children can be rendered alongside their parents. The tileset requires significantly less memory when
using this optimization. 

### skipLevels: number
> Constant defining the minimum number of levels to skip when loading tiles. When it is 0, no levels are skipped.
For example, if a tile is level 1, no tiles will be loaded unless they are at level greater than 2. Only used when Cesium3DTileset#skipLevelOfDetail is true . 

### skipScreenSpaceErrorFactor: number
> Multiplier defining the minimum screen space error to skip.
For example, if a tile has screen space error of 100, no tiles will be loaded unless they
are leaves or have a screen space error < = 100 / skipScreenSpaceErrorFactor . Only used when Cesium3DTileset#skipLevelOfDetail is true . 

### splitDirection:SplitDirection
> The SplitDirection to apply to this tileset. 

### style:Cesium3DTileStyle|undefined
> The style, defined using the 3D Tiles Styling language ,
applied to each feature in the tileset. Assign undefined to remove the style, which will restore the visual
appearance of the tileset to its default when no style was applied. The style is applied to a tile before the Cesium3DTileset#tileVisible event is raised, so code in tileVisible can manually set a feature's
properties (e.g. color and show) after the style is applied. When
a new style is assigned any manually set properties are overwritten. Use an always "true" condition to specify the Color for all objects that are not
overridden by pre-existing conditions. Otherwise, the default color Cesium.Color.White
will be used. Similarly, use an always "true" condition to specify the show property
for all objects that are not overridden by pre-existing conditions. Otherwise, the
default show value true will be used. 

### tileFailed:Event
> The event fired to indicate that a tile's content failed to load. If there are no event listeners, error messages will be logged to the console. The error object passed to the listener contains two properties: url : the url of the failed tile. message : the error message. If multiple contents are present, this event is raised once per inner content with errors. 

### tileLoad:Event
> The event fired to indicate that a tile's content was loaded. The loaded Cesium3DTile is passed to the event listener. This event is fired during the tileset traversal while the frame is being rendered
so that updates to the tile take effect in the same frame.  Do not create or modify
Cesium entities or primitives during the event listener. 

### readonlytilesLoaded: boolean
> When true , all tiles that meet the screen space error this frame are loaded. The tileset is
completely loaded for this view. 

### tileUnload:Event
> The event fired to indicate that a tile's content was unloaded. The unloaded Cesium3DTile is passed to the event listener. This event is fired immediately before the tile's content is unloaded while the frame is being
rendered so that the event listener has access to the tile's content.  Do not create
or modify Cesium entities or primitives during the event listener. 

### tileVisible:Event
> This event fires once for each visible tile in a frame.  This can be used to manually
style a tileset. The visible Cesium3DTile is passed to the event listener. This event is fired during the tileset traversal while the frame is being rendered
so that updates to the tile take effect in the same frame.  Do not create or modify
Cesium entities or primitives during the event listener. 

### readonlytimeSinceLoad: number
> Returns the time, in milliseconds, since the tileset was loaded and first updated. 

### readonlytotalMemoryUsageInBytes: number
> The total amount of GPU memory in bytes used by the tileset. This value is estimated from
geometry, texture, batch table textures, and binary metadata of loaded tiles. 

### vectorClassificationOnly: boolean
> Indicates that only the tileset's vector tiles should be used for classification. 

### vectorKeepDecodedPositions: boolean
> Whether vector tiles should keep decoded positions in memory.
This is used with Cesium3DTileFeature.getPolylinePositions . 

## Methods
### staticCesium.Cesium3DTileset.fromIonAssetId(assetId,options)→Promise.<Cesium3DTileset>
> Creates a 3D Tiles tileset ,
used for streaming massive heterogeneous 3D geospatial datasets, from a Cesium ion asset ID. 

| Name | Type | Description |
| --- | --- | --- |
 |
| assetId| number| The Cesium ion asset id. |
| options| Cesium3DTileset.ConstructorOptions| optionalAn object describing initialization options |

### staticCesium.Cesium3DTileset.fromUrl(url,options)→Promise.<Cesium3DTileset>
> Creates a 3D Tiles tileset ,
used for streaming massive heterogeneous 3D geospatial datasets. 

| Name | Type | Description |
| --- | --- | --- |
 |
| url| Resource\|string| The url to a tileset JSON file. |
| options| Cesium3DTileset.ConstructorOptions| optionalAn object describing initialization options |

### staticCesium.Cesium3DTileset.loadJson(tilesetUrl)→Promise.<object>
> Provides a hook to override the method used to request the tileset json
useful when fetching tilesets from remote servers 

| Name | Type | Description |
| --- | --- | --- |
 |
| tilesetUrl| Resource\|string| The url of the json file to be fetched |

### destroy()
> Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
release of WebGL resources, instead of relying on the garbage collector to destroy this object. Once an object is destroyed, it should not be used; calling any function other than isDestroyed will result in a DeveloperError exception.  Therefore,
assign the return value ( undefined ) to the object as done in the example. 

### getHeight(cartographic, scene)→number|undefined
> Get the height of the loaded surface at a given cartographic. This function will only take into account meshes for loaded tiles, not neccisarily the most detailed tiles available for a tileset. This function will always return undefined when sampling a point cloud. 

| Name | Type | Description |
| --- | --- | --- |
 |
| cartographic| Cartographic| The cartographic for which to find the height. |
| scene| Scene| The scene where visualization is taking place. |

### hasExtension(extensionName)→boolean
> true if the tileset JSON file lists the extension in extensionsUsed; otherwise, false . 

| Name | Type | Description |
| --- | --- | --- |
 |
| extensionName| string| The name of the extension to check. |

### isDestroyed()→boolean
> Returns true if this object was destroyed; otherwise, false. If this object was destroyed, it should not be used; calling any function other than isDestroyed will result in a DeveloperError exception. 

### makeStyleDirty()
> Marks the tileset's Cesium3DTileset#style as dirty, which forces all
features to re-evaluate the style in the next frame each is visible. 

### trimLoadedTiles()
> Unloads all tiles that weren't selected the previous frame.  This can be used to
explicitly manage the tile cache and reduce the total number of tiles loaded below Cesium3DTileset#cacheBytes . Tile unloads occur at the next frame to keep all the WebGL delete calls
within the render loop. 

## Type Definitions
### Cesium.Cesium3DTileset.ConstructorOptions
> Initialization options for the Cesium3DTileset constructor 

| Name | Type | Description |
| --- | --- | --- |
 |
| show| boolean| <optional>| true| Determines if the tileset will be shown. |
| modelMatrix| Matrix4| <optional>| Matrix4.IDENTITY| A 4x4 transformation matrix that transforms the tileset's root tile. |
| modelUpAxis| Axis| <optional>| Axis.Y| Which axis is considered up when loading models for tile contents. |
| modelForwardAxis| Axis| <optional>| Axis.X| Which axis is considered forward when loading models for tile contents. |
| shadows| ShadowMode| <optional>| ShadowMode.ENABLED| Determines whether the tileset casts or receives shadows from light sources. |
| maximumScreenSpaceError| number| <optional>| 16| The maximum screen space error used to drive level of detail refinement. |
| cacheBytes| number| <optional>| 536870912| The size (in bytes) to which the tile cache will be trimmed, if the cache contains tiles not needed for the current view. |
| maximumCacheOverflowBytes| number| <optional>| 536870912| The maximum additional memory (in bytes) to allow for cache headroom, if more thanCesium3DTileset#cacheBytesare needed for the current view. |
| cullWithChildrenBounds| boolean| <optional>| true| Optimization option. Whether to cull tiles using the union of their children bounding volumes. |
| cullRequestsWhileMoving| boolean| <optional>| true| Optimization option. Don't request tiles that will likely be unused when they come back because of the camera's movement. This optimization only applies to stationary tilesets. |
| cullRequestsWhileMovingMultiplier| number| <optional>| 60.0| Optimization option. Multiplier used in culling requests while moving. Larger is more aggressive culling, smaller less aggressive culling. |
| preloadWhenHidden| boolean| <optional>| false| Preload tiles whentileset.showisfalse. Loads tiles as if the tileset is visible but does not render them. |
| preloadFlightDestinations| boolean| <optional>| true| Optimization option. Preload tiles at the camera's flight destination while the camera is in flight. |
| preferLeaves| boolean| <optional>| false| Optimization option. Prefer loading of leaves first. |
| dynamicScreenSpaceError| boolean| <optional>| true| Optimization option. For street-level horizon views, use lower resolution tiles far from the camera. This reduces the amount of data loaded and improves tileset loading time with a slight drop in visual quality in the distance. |
| dynamicScreenSpaceErrorDensity| number| <optional>| 2.0e-4| Similar toFog#density, this option controls the camera distance at which theCesium3DTileset#dynamicScreenSpaceErroroptimization applies. Larger values will cause tiles closer to the camera to be affected. |
| dynamicScreenSpaceErrorFactor| number| <optional>| 24.0| A parameter that controls the intensity of theCesium3DTileset#dynamicScreenSpaceErroroptimization for tiles on the horizon. Larger values cause lower resolution tiles to load, improving runtime performance at a slight reduction of visual quality. |
| dynamicScreenSpaceErrorHeightFalloff| number| <optional>| 0.25| A ratio of the tileset's height that determines where "street level" camera views occur. When the camera is below this height, theCesium3DTileset#dynamicScreenSpaceErroroptimization will have the maximum effect, and it will roll off above this value. |
| progressiveResolutionHeightFraction| number| <optional>| 0.3| Optimization option. If between (0.0, 0.5], tiles at or above the screen space error for the reduced screen resolution ofprogressiveResolutionHeightFraction*screenHeightwill be prioritized first. This can help get a quick layer of tiles down while full resolution tiles continue to load. |
| foveatedScreenSpaceError| boolean| <optional>| true| Optimization option. Prioritize loading tiles in the center of the screen by temporarily raising the screen space error for tiles around the edge of the screen. Screen space error returns to normal once all the tiles in the center of the screen as determined by theCesium3DTileset#foveatedConeSizeare loaded. |
| foveatedConeSize| number| <optional>| 0.1| Optimization option. Used whenCesium3DTileset#foveatedScreenSpaceErroris true to control the cone size that determines which tiles are deferred. Tiles that are inside this cone are loaded immediately. Tiles outside the cone are potentially deferred based on how far outside the cone they are and their screen space error. This is controlled byCesium3DTileset#foveatedInterpolationCallbackandCesium3DTileset#foveatedMinimumScreenSpaceErrorRelaxation. Setting this to 0.0 means the cone will be the line formed by the camera position and its view direction. Setting this to 1.0 means the cone encompasses the entire field of view of the camera, disabling the effect. |
| foveatedMinimumScreenSpaceErrorRelaxation| number| <optional>| 0.0| Optimization option. Used whenCesium3DTileset#foveatedScreenSpaceErroris true to control the starting screen space error relaxation for tiles outside the foveated cone. The screen space error will be raised starting with tileset value up toCesium3DTileset#maximumScreenSpaceErrorbased on the providedCesium3DTileset#foveatedInterpolationCallback. |
| foveatedInterpolationCallback| Cesium3DTileset.foveatedInterpolationCallback| <optional>| Math.lerp| Optimization option. Used whenCesium3DTileset#foveatedScreenSpaceErroris true to control how much to raise the screen space error for tiles outside the foveated cone, interpolating betweenCesium3DTileset#foveatedMinimumScreenSpaceErrorRelaxationandCesium3DTileset#maximumScreenSpaceError |
| foveatedTimeDelay| number| <optional>| 0.2| Optimization option. Used whenCesium3DTileset#foveatedScreenSpaceErroris true to control how long in seconds to wait after the camera stops moving before deferred tiles start loading in. This time delay prevents requesting tiles around the edges of the screen when the camera is moving. Setting this to 0.0 will immediately request all tiles in any given view. |
| skipLevelOfDetail| boolean| <optional>| false| Optimization option. Determines if level of detail skipping should be applied during the traversal. |
| baseScreenSpaceError| number| <optional>| 1024| WhenskipLevelOfDetailistrue, the screen space error that must be reached before skipping levels of detail. |
| skipScreenSpaceErrorFactor| number| <optional>| 16| WhenskipLevelOfDetailistrue, a multiplier defining the minimum screen space error to skip. Used in conjunction withskipLevelsto determine which tiles to load. |
| skipLevels| number| <optional>| 1| WhenskipLevelOfDetailistrue, a constant defining the minimum number of levels to skip when loading tiles. When it is 0, no levels are skipped. Used in conjunction withskipScreenSpaceErrorFactorto determine which tiles to load. |
| immediatelyLoadDesiredLevelOfDetail| boolean| <optional>| false| WhenskipLevelOfDetailistrue, only tiles that meet the maximum screen space error will ever be downloaded. Skipping factors are ignored and just the desired tiles are loaded. |
| loadSiblings| boolean| <optional>| false| WhenskipLevelOfDetailistrue, determines whether siblings of visible tiles are always downloaded during traversal. |
| clippingPlanes| ClippingPlaneCollection| <optional>| | TheClippingPlaneCollectionused to selectively disable rendering the tileset. |
| clippingPolygons| ClippingPolygonCollection| <optional>| | TheClippingPolygonCollectionused to selectively disable rendering the tileset. |
| classificationType| ClassificationType| <optional>| | Determines whether terrain, 3D Tiles or both will be classified by this tileset. SeeCesium3DTileset#classificationTypefor details about restrictions and limitations. |
| heightReference| HeightReference| <optional>| | Sets theHeightReferencefor point features in vector tilesets. |
| scene| Scene| <optional>| | TheCesiumWidget#scenethat the tileset will be rendered in, required for tilesets that specify aheightReferencevalue for clamping 3D Tiles vector data content- like points, lines, and labels- to terrain or 3D tiles. |
| ellipsoid| Ellipsoid| <optional>| Ellipsoid.WGS84| The ellipsoid determining the size and shape of the globe. |
| pointCloudShading| object| <optional>| | Options for constructing aPointCloudShadingobject to control point attenuation based on geometric error and lighting. |
| lightColor| Cartesian3| <optional>| | The light color when shading models. Whenundefinedthe scene's light color is used instead. |
| imageBasedLighting| ImageBasedLighting| <optional>| | The properties for managing image-based lighting for this tileset. |
| environmentMapOptions| DynamicEnvironmentMapManager.ConstructorOptions| <optional>| | The properties for managing dynamic environment maps on this tileset. |
| backFaceCulling| boolean| <optional>| true| Whether to cull back-facing geometry. When true, back face culling is determined by the glTF material's doubleSided property; when false, back face culling is disabled. |
| enableShowOutline| boolean| <optional>| true| Whether to enable outlines for models using theCESIUM_primitive_outlineextension. This can be set to false to avoid the additional processing of geometry at load time. When false, the showOutlines and outlineColor options are ignored. |
| showOutline| boolean| <optional>| true| Whether to display the outline for models using theCESIUM_primitive_outlineextension. When true, outlines are displayed. When false, outlines are not displayed. |
| outlineColor| Color| <optional>| Color.BLACK| The color to use when rendering outlines. |
| vectorClassificationOnly| boolean| <optional>| false| Indicates that only the tileset's vector tiles should be used for classification. |
| vectorKeepDecodedPositions| boolean| <optional>| false| Whether vector tiles should keep decoded positions in memory. This is used withCesium3DTileFeature.getPolylinePositions. |
| featureIdLabel| string\|number| <optional>| "featureId_0"| Label of the feature ID set to use for picking and styling. For EXT_mesh_features, this is the feature ID's label property, or "featureId_N" (where N is the index in the featureIds array) when not specified. EXT_feature_metadata did not have a label field, so such feature ID sets are always labeled "featureId_N" where N is the index in the list of all feature Ids, where feature ID attributes are listed before feature ID textures. If featureIdLabel is an integer N, it is converted to the string "featureId_N" automatically. If both per-primitive and per-instance feature IDs are present, the instance feature IDs take priority. |
| instanceFeatureIdLabel| string\|number| <optional>| "instanceFeatureId_0"| Label of the instance feature ID set used for picking and styling. If instanceFeatureIdLabel is set to an integer N, it is converted to the string "instanceFeatureId_N" automatically. If both per-primitive and per-instance feature IDs are present, the instance feature IDs take priority. |
| showCreditsOnScreen| boolean| <optional>| false| Whether to display the credits of this tileset on screen. |
| splitDirection| SplitDirection| <optional>| SplitDirection.NONE| TheSplitDirectionsplit to apply to this tileset. |
| enableCollision| boolean| <optional>| false| Whentrue, enables collisions for camera or CPU picking. While this istruethe camera will be prevented from going below the tileset surface ifScreenSpaceCameraController#enableCollisionDetectionis true. This also affects the behavior ofHeightReference.CLAMP_TO_GROUNDwhen clamping to 3D Tiles surfaces. IfenableCollisionisfalse, entities may not be correctly clamped to the tileset geometry. |
| projectTo2D| boolean| <optional>| false| Whether to accurately project the tileset to 2D. If this is true, the tileset will be projected accurately to 2D, but it will use more memory to do so. If this is false, the tileset will use less memory and will still render in 2D / CV mode, but its projected positions may be inaccurate. This cannot be set after the tileset has been created. |
| enablePick| boolean| <optional>| false| Whether to allow collision and CPU picking withpickwhen using WebGL 1. If using WebGL 2 or above, this option will be ignored. If using WebGL 1 and this is true, thepickoperation will work correctly, but it will use more memory to do so. If running with WebGL 1 and this is false, the model will use less memory, butpickwill always returnundefined. This cannot be set after the tileset has loaded. |
| asynchronouslyLoadImagery| boolean| <optional>| false| Whether loading imagery that is draped over the tileset should be done asynchronously. If this istrue, then tile content will be displayed with its original texture until the imagery texture is loaded. If this isfalse, then the tile content will not be displayed until the imagery is ready. |
| debugHeatmapTilePropertyName| string| <optional>| | The tile variable to colorize as a heatmap. All rendered tiles will be colorized relative to each other's specified variable value. |
| debugFreezeFrame| boolean| <optional>| false| For debugging only. Determines if only the tiles from last frame should be used for rendering. |
| debugColorizeTiles| boolean| <optional>| false| For debugging only. When true, assigns a random color to each tile. |
| enableDebugWireframe| boolean| <optional>| false| For debugging only. This must be true for debugWireframe to work in WebGL1. This cannot be set after the tileset has been created. |
| debugWireframe| boolean| <optional>| false| For debugging only. When true, render's each tile's content as a wireframe. |
| debugShowBoundingVolume| boolean| <optional>| false| For debugging only. When true, renders the bounding volume for each tile. |
| debugShowContentBoundingVolume| boolean| <optional>| false| For debugging only. When true, renders the bounding volume for each tile's content. |
| debugShowViewerRequestVolume| boolean| <optional>| false| For debugging only. When true, renders the viewer request volume for each tile. |
| debugShowGeometricError| boolean| <optional>| false| For debugging only. When true, draws labels to indicate the geometric error of each tile. |
| debugShowRenderingStatistics| boolean| <optional>| false| For debugging only. When true, draws labels to indicate the number of commands, points, triangles and features for each tile. |
| debugShowMemoryUsage| boolean| <optional>| false| For debugging only. When true, draws labels to indicate the texture and geometry memory in megabytes used by each tile. |
| debugShowUrl| boolean| <optional>| false| For debugging only. When true, draws labels to indicate the url of each tile. |

### Cesium.Cesium3DTileset.foveatedInterpolationCallback(p, q, time)→number
> Optimization option. Used as a callback when Cesium3DTileset#foveatedScreenSpaceError is true to control how much to raise the screen space error for tiles outside the foveated cone,
interpolating between Cesium3DTileset#foveatedMinimumScreenSpaceErrorRelaxation and Cesium3DTileset#maximumScreenSpaceError . 

| Name | Type | Description |
| --- | --- | --- |
 |
| p| number| The start value to interpolate. |
| q| number| The end value to interpolate. |
| time| number| The time of interpolation generally in the range[0.0, 1.0]. |


---

# GeoJsonDataSource
### new Cesium.GeoJsonDataSource(name)
> A DataSource which processes both GeoJSON and TopoJSON data. simplestyle-spec properties will also be used if they
are present. 

| Name | Type | Description |
| --- | --- | --- |
 |
| name| string| optionalThe name of this data source.  If undefined, a name will be taken from                        the name of the GeoJSON file. |

## Members
### staticCesium.GeoJsonDataSource.clampToGround: boolean
> Gets or sets default of whether to clamp to the ground. 

### staticCesium.GeoJsonDataSource.crsLinkHrefs: object
> Gets an object that maps the href property of a crs link to a callback function
which takes the crs properties object and returns a Promise that resolves
to a function that takes a GeoJSON coordinate and transforms it into a WGS84 Earth-fixed Cartesian.
Items in this object take precedence over those defined in crsLinkHrefs , assuming
the link has a type specified. 

### staticCesium.GeoJsonDataSource.crsLinkTypes: object
> Gets an object that maps the type property of a crs link to a callback function
which takes the crs properties object and returns a Promise that resolves
to a function that takes a GeoJSON coordinate and transforms it into a WGS84 Earth-fixed Cartesian.
Items in crsLinkHrefs take precedence over this object. 

### staticCesium.GeoJsonDataSource.crsNames: object
> Gets an object that maps the name of a crs to a callback function which takes a GeoJSON coordinate
and transforms it into a WGS84 Earth-fixed Cartesian.  Older versions of GeoJSON which
supported the EPSG type can be added to this list as well, by specifying the complete EPSG name,
for example 'EPSG:4326'. 

### staticCesium.GeoJsonDataSource.fill:Color
> Gets or sets default color for polygon interiors. 

### staticCesium.GeoJsonDataSource.markerColor:Color
> Gets or sets the default color of the map pin created for each point. 

### staticCesium.GeoJsonDataSource.markerSize: number
> Gets or sets the default size of the map pin created for each point, in pixels. 

### staticCesium.GeoJsonDataSource.markerSymbol: string
> Gets or sets the default symbol of the map pin created for each point.
This can be any valid Maki identifier, any single character,
or blank if no symbol is to be used. 

### staticCesium.GeoJsonDataSource.stroke:Color
> Gets or sets the default color of polylines and polygon outlines. 

### staticCesium.GeoJsonDataSource.strokeWidth: number
> Gets or sets the default width of polylines and polygon outlines. 

### changedEvent:Event
> Gets an event that will be raised when the underlying data changes. 

### clock:DataSourceClock
> This DataSource only defines static data, therefore this property is always undefined. 

### clustering:EntityCluster
> Gets or sets the clustering options for this data source. This object can be shared between multiple data sources. 

### credit:Credit
> Gets the credit that will be displayed for the data source 

### entities:EntityCollection
> Gets the collection of Entity instances. 

### errorEvent:Event
> Gets an event that will be raised if an error is encountered during processing. 

### isLoading: boolean
> Gets a value indicating if the data source is currently loading data. 

### loadingEvent:Event
> Gets an event that will be raised when the data source either starts or stops loading. 

### name: string
> Gets or sets a human-readable name for this instance. 

### show: boolean
> Gets whether or not this data source should be displayed. 

## Methods
### staticCesium.GeoJsonDataSource.load(data,options)→Promise.<GeoJsonDataSource>
> Creates a Promise to a new instance loaded with the provided GeoJSON or TopoJSON data. 

| Name | Type | Description |
| --- | --- | --- |
 |
| data| Resource\|string\|object| A url, GeoJSON object, or TopoJSON object to be loaded. |
| options| GeoJsonDataSource.LoadOptions| optionalAn object specifying configuration options |

### load(data,options)→Promise.<GeoJsonDataSource>
> Asynchronously loads the provided GeoJSON or TopoJSON data, replacing any existing data. 

| Name | Type | Description |
| --- | --- | --- |
 |
| data| Resource\|string\|object| A url, GeoJSON object, or TopoJSON object to be loaded. |
| options| GeoJsonDataSource.LoadOptions| optionalAn object specifying configuration options |

### process(data,options)→Promise.<GeoJsonDataSource>
> Asynchronously loads the provided GeoJSON or TopoJSON data, without replacing any existing data. 

| Name | Type | Description |
| --- | --- | --- |
 |
| data| Resource\|string\|object| A url, GeoJSON object, or TopoJSON object to be loaded. |
| options| GeoJsonDataSource.LoadOptions| optionalAn object specifying configuration options |

### update(time)→boolean
> Updates the data source to the provided time.  This function is optional and
is not required to be implemented.  It is provided for data sources which
retrieve data based on the current animation time or scene state.
If implemented, update will be called by DataSourceDisplay once a frame. 

| Name | Type | Description |
| --- | --- | --- |
 |
| time| JulianDate| The simulation time. |

## Type Definitions
### Cesium.GeoJsonDataSource.describe(properties, nameProperty)
> This callback is displayed as part of the GeoJsonDataSource class. 

| Name | Type | Description |
| --- | --- | --- |
 |
| properties| object| The properties of the feature. |
| nameProperty| string| The property key that Cesium estimates to have the name of the feature. |

### Cesium.GeoJsonDataSource.LoadOptions
> Initialization options for the load method. 

| Name | Type | Description |
| --- | --- | --- |
 |
| sourceUri| string| <optional>| | Overrides the url to use for resolving relative links. |
| describe| GeoJsonDataSource.describe| <optional>| GeoJsonDataSource.defaultDescribeProperty| A function which returns a Property object (or just a string). |
| markerSize| number| <optional>| GeoJsonDataSource.markerSize| The default size of the map pin created for each point, in pixels. |
| markerSymbol| string| <optional>| GeoJsonDataSource.markerSymbol| The default symbol of the map pin created for each point. |
| markerColor| Color| <optional>| GeoJsonDataSource.markerColor| The default color of the map pin created for each point. |
| stroke| Color| <optional>| GeoJsonDataSource.stroke| The default color of polylines and polygon outlines. |
| strokeWidth| number| <optional>| GeoJsonDataSource.strokeWidth| The default width of polylines and polygon outlines. |
| fill| Color| <optional>| GeoJsonDataSource.fill| The default color for polygon interiors. |
| clampToGround| boolean| <optional>| GeoJsonDataSource.clampToGround| true if we want the geometry features (polygons or linestrings) clamped to the ground. |
| credit| Credit\|string| <optional>| | A credit for the data source, which is displayed on the canvas. |


---

# KmlDataSource
### new Cesium.KmlDataSource(options)
> A DataSource which processes Keyhole Markup Language 2.2 (KML). KML support in Cesium is incomplete, but a large amount of the standard,
as well as Google's gx extension namespace, is supported. See Github issue #873 for a
detailed list of what is and isn't supported. Cesium will also write information to the
console when it encounters most unsupported features. Non visual feature data, such as atom:author and ExtendedData is exposed via an instance of KmlFeatureData , which is added to each Entity under the kml property. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| KmlDataSource.ConstructorOptions| optionalObject describing initialization options |

## Members
### camera:Camera|undefined
> The position and orientation of this Camera will be used to
populate various camera parameters when making network requests.
Camera movement will determine when to trigger NetworkLink refresh if viewRefreshMode is onStop . 

### canvas: HTMLCanvasElement|undefined
> The current size of this Canvas will be used to populate the Link parameters
for client height and width. 

### changedEvent:Event
> Gets an event that will be raised when the underlying data changes. 

### clock:DataSourceClock
> Gets the clock settings defined by the loaded KML. This represents the total
availability interval for all time-dynamic data. If the KML does not contain
time-dynamic data, this value is undefined. 

### clustering:EntityCluster
> Gets or sets the clustering options for this data source. This object can be shared between multiple data sources. 

### credit:Credit
> Gets the credit that will be displayed for the data source 

### entities:EntityCollection
> Gets the collection of Entity instances. 

### errorEvent:Event
> Gets an event that will be raised if an error is encountered during processing. 

### isLoading: boolean
> Gets a value indicating if the data source is currently loading data. 

### kmlTours: Array.<KmlTour>
> Gets the KML Tours that are used to guide the camera to specified destinations on given time intervals. 

### loadingEvent:Event
> Gets an event that will be raised when the data source either starts or stops loading. 

### name: string
> Gets or sets a human-readable name for this instance.
This will be automatically be set to the KML document name on load. 

### refreshEvent:Event
> Gets an event that will be raised when the data source refreshes a network link. 

### show: boolean
> Gets whether or not this data source should be displayed. 

### unsupportedNodeEvent:Event
> Gets an event that will be raised when the data source finds an unsupported node type. 

## Methods
### staticCesium.KmlDataSource.load(data,options)→Promise.<KmlDataSource>
> Creates a Promise to a new instance loaded with the provided KML data. 

| Name | Type | Description |
| --- | --- | --- |
 |
| data| Resource\|string\|Document\|Blob| A url, parsed KML document, or Blob containing binary KMZ data or a parsed KML document. |
| options| KmlDataSource.ConstructorOptions| optionalAn object specifying configuration options |

### destroy()
> Cleans up any non-entity elements created by the data source. Currently this only affects ScreenOverlay elements. 

### load(data,options)→Promise.<KmlDataSource>
> Asynchronously loads the provided KML data, replacing any existing data. 

| Name | Type | Description |
| --- | --- | --- |
 |
| data| Resource\|string\|Document\|Blob| A url, parsed KML document, or Blob containing binary KMZ data or a parsed KML document. |
| options| KmlDataSource.LoadOptions| optionalAn object specifying configuration options |

### update(time)→boolean
> Updates any NetworkLink that require updating. 

| Name | Type | Description |
| --- | --- | --- |
 |
| time| JulianDate| The simulation time. |

## Type Definitions
### Cesium.KmlDataSource.ConstructorOptions
> Options for constructing a new KmlDataSource, or calling the static `load` method. 

| Name | Type | Description |
| --- | --- | --- |
 |
| camera| Camera| <optional>| | The camera that is used for viewRefreshModes and sending camera properties to network links. |
| canvas| HTMLCanvasElement| <optional>| | The canvas that is used for sending viewer properties to network links. |
| credit| Credit\|string| <optional>| | A credit for the data source, which is displayed on the canvas. |
| sourceUri| string| <optional>| | Overrides the url to use for resolving relative links and other KML network features. |
| clampToGround| boolean| <optional>| false| true if we want the geometry features (Polygons, LineStrings and LinearRings) clamped to the ground. |
| ellipsoid| Ellipsoid| <optional>| Ellipsoid.default| The global ellipsoid used for geographical calculations. |
| screenOverlayContainer| Element\|string| <optional>| | A container for ScreenOverlay images. |

### Cesium.KmlDataSource.LoadOptions
> Initialization options for the `load` method. 

| Name | Type | Description |
| --- | --- | --- |
 |
| sourceUri| string| <optional>| | Overrides the url to use for resolving relative links and other KML network features. |
| clampToGround| boolean| <optional>| false| true if we want the geometry features (Polygons, LineStrings and LinearRings) clamped to the ground. |
| ellipsoid| Ellipsoid| <optional>| Ellipsoid.default| The global ellipsoid used for geographical calculations. |
| screenOverlayContainer| Element\|string| <optional>| | A container for ScreenOverlay images. |


---

# CzmlDataSource
### new Cesium.CzmlDataSource(name)
> A DataSource which processes CZML . 

| Name | Type | Description |
| --- | --- | --- |
 |
| name| string| optionalAn optional name for the data source.  This value will be overwritten if a loaded document contains a name. |

## Members
### staticCesium.CzmlDataSource.updaters: Array.<CzmlDataSource.UpdaterFunction>
> Gets the array of CZML processing functions. 

### changedEvent:Event
> Gets an event that will be raised when the underlying data changes. 

### clock:DataSourceClock
> Gets the clock settings defined by the loaded CZML.  If no clock is explicitly
defined in the CZML, the combined availability of all objects is returned.  If
only static data exists, this value is undefined. 

### clustering:EntityCluster
> Gets or sets the clustering options for this data source. This object can be shared between multiple data sources. 

### credit:Credit
> Gets the credit that will be displayed for the data source 

### entities:EntityCollection
> Gets the collection of Entity instances. 

### errorEvent:Event
> Gets an event that will be raised if an error is encountered during processing. 

### isLoading: boolean
> Gets a value indicating if the data source is currently loading data. 

### loadingEvent:Event
> Gets an event that will be raised when the data source either starts or stops loading. 

### name: string
> Gets a human-readable name for this instance. 

### show: boolean
> Gets whether or not this data source should be displayed. 

## Methods
### staticCesium.CzmlDataSource.load(czml,options)→Promise.<CzmlDataSource>
> Creates a Promise to a new instance loaded with the provided CZML data. 

| Name | Type | Description |
| --- | --- | --- |
 |
| czml| Resource\|string\|object| A url or CZML object to be processed. |
| options| CzmlDataSource.LoadOptions| optionalAn object specifying configuration options |

### staticCesium.CzmlDataSource.processMaterialPacketData(object, propertyName, packetData, interval, sourceUri, entityCollection)
> A helper function used by custom CZML updater functions
which creates or updates a MaterialProperty from a CZML packet. 

| Name | Type | Description |
| --- | --- | --- |
 |
| object| object| The object on which the property will be added or updated. |
| propertyName| string| The name of the property on the object. |
| packetData| object| The CZML packet being processed. |
| interval| TimeInterval| A constraining interval for which the data is valid. |
| sourceUri| string| The originating uri of the data being processed. |
| entityCollection| EntityCollection| The collection being processsed. |

### staticCesium.CzmlDataSource.processPacketData(type, object, propertyName, packetData, interval, sourceUri, entityCollection)
> A helper function used by custom CZML updater functions
which creates or updates a Property from a CZML packet. 

| Name | Type | Description |
| --- | --- | --- |
 |
| type| function| The constructor function for the property being processed. |
| object| object| The object on which the property will be added or updated. |
| propertyName| string| The name of the property on the object. |
| packetData| object| The CZML packet being processed. |
| interval| TimeInterval| A constraining interval for which the data is valid. |
| sourceUri| string| The originating uri of the data being processed. |
| entityCollection| EntityCollection| The collection being processsed. |

### staticCesium.CzmlDataSource.processPositionPacketData(object, propertyName, packetData, interval, sourceUri, entityCollection)
> A helper function used by custom CZML updater functions
which creates or updates a PositionProperty from a CZML packet. 

| Name | Type | Description |
| --- | --- | --- |
 |
| object| object| The object on which the property will be added or updated. |
| propertyName| string| The name of the property on the object. |
| packetData| object| The CZML packet being processed. |
| interval| TimeInterval| A constraining interval for which the data is valid. |
| sourceUri| string| The originating uri of the data being processed. |
| entityCollection| EntityCollection| The collection being processsed. |

### load(czml,options)→Promise.<CzmlDataSource>
> Loads the provided url or CZML object, replacing any existing data. 

| Name | Type | Description |
| --- | --- | --- |
 |
| czml| Resource\|string\|object| A url or CZML object to be processed. |
| options| CzmlDataSource.LoadOptions| optionalAn object specifying configuration options |

### process(czml,options)→Promise.<CzmlDataSource>
> Processes the provided url or CZML object without clearing any existing data. 

| Name | Type | Description |
| --- | --- | --- |
 |
| czml| Resource\|string\|object| A url or CZML object to be processed. |
| options| CzmlDataSource.LoadOptions| optionalAn object specifying configuration options |

### update(time)→boolean
> Updates the data source to the provided time.  This function is optional and
is not required to be implemented.  It is provided for data sources which
retrieve data based on the current animation time or scene state.
If implemented, update will be called by DataSourceDisplay once a frame. 

| Name | Type | Description |
| --- | --- | --- |
 |
| time| JulianDate| The simulation time. |

## Type Definitions
### Cesium.CzmlDataSource.LoadOptions
> Initialization options for the load method. 

| Name | Type | Description |
| --- | --- | --- |
 |
| sourceUri| Resource\|string| <optional>| Overrides the url to use for resolving relative links. |
| credit| Credit\|string| <optional>| A credit for the data source, which is displayed on the canvas. |

### Cesium.CzmlDataSource.UpdaterFunction(entity, packet, entityCollection, sourceUri)
| Name | Type | Description |
| --- | --- | --- |
 |
| entity| Entity|  |
| packet| object|  |
| entityCollection| EntityCollection|  |
| sourceUri| string|  |


---

# ImageryLayer
### new Cesium.ImageryLayer(imageryProvider,options)
> An imagery layer that displays tiled image data from a single imagery provider
on a Globe or Cesium3DTileset . 

| Name | Type | Description |
| --- | --- | --- |
 |
| imageryProvider| ImageryProvider| optionalThe imagery provider to use. |
| options| ImageryLayer.ConstructorOptions| optionalAn object describing initialization options |

## Members
### staticCesium.ImageryLayer.DEFAULT_APPLY_COLOR_TO_ALPHA_THRESHOLD: number
> This value is used as the default threshold for color-to-alpha if one is not provided
during construction or by the imagery provider. 

### staticCesium.ImageryLayer.DEFAULT_BRIGHTNESS: number
> This value is used as the default brightness for the imagery layer if one is not provided during construction
or by the imagery provider. This value does not modify the brightness of the imagery. 

### staticCesium.ImageryLayer.DEFAULT_CONTRAST: number
> This value is used as the default contrast for the imagery layer if one is not provided during construction
or by the imagery provider. This value does not modify the contrast of the imagery. 

### staticCesium.ImageryLayer.DEFAULT_GAMMA: number
> This value is used as the default gamma for the imagery layer if one is not provided during construction
or by the imagery provider. This value does not modify the gamma of the imagery. 

### staticCesium.ImageryLayer.DEFAULT_HUE: number
> This value is used as the default hue for the imagery layer if one is not provided during construction
or by the imagery provider. This value does not modify the hue of the imagery. 

### staticCesium.ImageryLayer.DEFAULT_MAGNIFICATION_FILTER:TextureMagnificationFilter
> This value is used as the default texture magnification filter for the imagery layer if one is not provided
during construction or by the imagery provider. 

### staticCesium.ImageryLayer.DEFAULT_MINIFICATION_FILTER:TextureMinificationFilter
> This value is used as the default texture minification filter for the imagery layer if one is not provided
during construction or by the imagery provider. 

### staticCesium.ImageryLayer.DEFAULT_SATURATION: number
> This value is used as the default saturation for the imagery layer if one is not provided during construction
or by the imagery provider. This value does not modify the saturation of the imagery. 

### staticCesium.ImageryLayer.DEFAULT_SPLIT:SplitDirection
> This value is used as the default split for the imagery layer if one is not provided during construction
or by the imagery provider. 

### alpha: number
> The alpha blending value of this layer, with 0.0 representing fully transparent and
1.0 representing fully opaque. 

### brightness: number
> The brightness of this layer.  1.0 uses the unmodified imagery color.  Less than 1.0
makes the imagery darker while greater than 1.0 makes it brighter. 

### colorToAlpha:Color
> Color value that should be set to transparent. 

### colorToAlphaThreshold: number
> Normalized (0-1) threshold for color-to-alpha. 

### contrast: number
> The contrast of this layer.  1.0 uses the unmodified imagery color.  Less than 1.0 reduces
the contrast while greater than 1.0 increases it. 

### cutoutRectangle:Rectangle
> Rectangle cutout in this layer of imagery. 

### dayAlpha: number
> The alpha blending value of this layer on the day side of the globe, with 0.0 representing fully transparent and
1.0 representing fully opaque. This only takes effect when Globe#enableLighting is true . 

### readonlyerrorEvent:Event.<ImageryLayer.ErrorEventCallback>
> Gets an event that is raised when the imagery provider encounters an asynchronous error.  By subscribing
to the event, you will be notified of the error and can potentially recover from it.  Event listeners
are passed an instance of the thrown error. 

### gamma: number
> The gamma correction to apply to this layer.  1.0 uses the unmodified imagery color. 

### hue: number
> The hue of this layer in radians. 0.0 uses the unmodified imagery color. 

### readonlyimageryProvider:ImageryProvider
> Gets the imagery provider for this layer. This should not be called before ImageryLayer#ready returns true. 

### magnificationFilter:TextureMagnificationFilter
> The TextureMagnificationFilter to apply to this layer.
Possible values are TextureMagnificationFilter.LINEAR (the default)
and TextureMagnificationFilter.NEAREST .

To take effect, this property must be set immediately after adding the imagery layer.
Once a texture is loaded it won't be possible to change the texture filter used. 

### minificationFilter:TextureMinificationFilter
> The TextureMinificationFilter to apply to this layer.
Possible values are TextureMinificationFilter.LINEAR (the default)
and TextureMinificationFilter.NEAREST .

To take effect, this property must be set immediately after adding the imagery layer.
Once a texture is loaded it won't be possible to change the texture filter used. 

### nightAlpha: number
> The alpha blending value of this layer on the night side of the globe, with 0.0 representing fully transparent and
1.0 representing fully opaque. This only takes effect when Globe#enableLighting is true . 

### readonlyready: boolean
> Returns true when the terrain provider has been successfully created. Otherwise, returns false. 

### readonlyreadyEvent:Event.<ImageryLayer.ReadyEventCallback>
> Gets an event that is raised when the imagery provider has been successfully created. Event listeners
are passed the created instance of ImageryProvider . 

### readonlyrectangle:Rectangle
> Gets the rectangle of this layer.  If this rectangle is smaller than the rectangle of the ImageryProvider , only a portion of the imagery provider is shown. 

### saturation: number
> The saturation of this layer. 1.0 uses the unmodified imagery color. Less than 1.0 reduces the
saturation while greater than 1.0 increases it. 

### show: boolean
> Determines if this layer is shown. 

### splitDirection:SplitDirection
> The SplitDirection to apply to this layer. 

## Methods
### staticCesium.ImageryLayer.fromProviderAsync(imageryProviderPromise,options)→ImageryLayer
> Create a new imagery layer from an asynchronous imagery provider. The layer will handle any asynchronous loads or errors, and begin rendering the imagery layer once ready. 

| Name | Type | Description |
| --- | --- | --- |
 |
| imageryProviderPromise| Promise.<ImageryProvider>| A promise which resolves to a imagery provider |
| options| ImageryLayer.ConstructorOptions| optionalAn object describing initialization options |

### staticCesium.ImageryLayer.fromWorldImagery(options)→ImageryLayer
> Create a new imagery layer for ion's default global base imagery layer, currently Bing Maps. The layer will handle any asynchronous loads or errors, and begin rendering the imagery layer once ready. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| ImageryLayer.WorldImageryConstructorOptions| An object describing initialization options |

### destroy()
> Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
release of WebGL resources, instead of relying on the garbage collector to destroy this object. Once an object is destroyed, it should not be used; calling any function other than isDestroyed will result in a DeveloperError exception.  Therefore,
assign the return value ( undefined ) to the object as done in the example. 

### getImageryRectangle()→Rectangle
> Computes the intersection of this layer's rectangle with the imagery provider's availability rectangle,
producing the overall bounds of imagery that can be produced by this layer. 

### isBaseLayer()→boolean
> Gets a value indicating whether this layer is the base layer in the ImageryLayerCollection .  The base layer is the one that underlies all
others.  It is special in that it is treated as if it has global rectangle, even if
it actually does not, by stretching the texels at the edges over the entire
globe. 

### isDestroyed()→boolean
> Returns true if this object was destroyed; otherwise, false. If this object was destroyed, it should not be used; calling any function other than isDestroyed will result in a DeveloperError exception. 

## Type Definitions
### Cesium.ImageryLayer.ConstructorOptions
> Initialization options for the ImageryLayer constructor. 

| Name | Type | Description |
| --- | --- | --- |
 |
| rectangle| Rectangle| <optional>| imageryProvider.rectangle| The rectangle of the layer.  This rectangle        can limit the visible portion of the imagery provider. |
| alpha| number\|function| <optional>| 1.0| The alpha blending value of this layer, from 0.0 to 1.0.                          This can either be a simple number or a function with the signaturefunction(frameState, layer, x, y, level).  The function is passed the                          current frame state, this layer, and the x, y, and level coordinates of the                          imagery tile for which the alpha is required, and it is expected to return                          the alpha value to use for the tile. |
| nightAlpha| number\|function| <optional>| 1.0| The alpha blending value of this layer on the night side of the globe, from 0.0 to 1.0.                          This can either be a simple number or a function with the signaturefunction(frameState, layer, x, y, level).  The function is passed the                          current frame state, this layer, and the x, y, and level coordinates of the                          imagery tile for which the alpha is required, and it is expected to return                          the alpha value to use for the tile. This only takes effect whenenableLightingistrue. |
| dayAlpha| number\|function| <optional>| 1.0| The alpha blending value of this layer on the day side of the globe, from 0.0 to 1.0.                          This can either be a simple number or a function with the signaturefunction(frameState, layer, x, y, level).  The function is passed the                          current frame state, this layer, and the x, y, and level coordinates of the                          imagery tile for which the alpha is required, and it is expected to return                          the alpha value to use for the tile. This only takes effect whenenableLightingistrue. |
| brightness| number\|function| <optional>| 1.0| The brightness of this layer.  1.0 uses the unmodified imagery                          color.  Less than 1.0 makes the imagery darker while greater than 1.0 makes it brighter.                          This can either be a simple number or a function with the signaturefunction(frameState, layer, x, y, level).  The function is passed the                          current frame state, this layer, and the x, y, and level coordinates of the                          imagery tile for which the brightness is required, and it is expected to return                          the brightness value to use for the tile.  The function is executed for every                          frame and for every tile, so it must be fast. |
| contrast| number\|function| <optional>| 1.0| The contrast of this layer.  1.0 uses the unmodified imagery color.                          Less than 1.0 reduces the contrast while greater than 1.0 increases it.                          This can either be a simple number or a function with the signaturefunction(frameState, layer, x, y, level).  The function is passed the                          current frame state, this layer, and the x, y, and level coordinates of the                          imagery tile for which the contrast is required, and it is expected to return                          the contrast value to use for the tile.  The function is executed for every                          frame and for every tile, so it must be fast. |
| hue| number\|function| <optional>| 0.0| The hue of this layer.  0.0 uses the unmodified imagery color.                          This can either be a simple number or a function with the signaturefunction(frameState, layer, x, y, level).  The function is passed the                          current frame state, this layer, and the x, y, and level coordinates                          of the imagery tile for which the hue is required, and it is expected to return                          the hue value to use for the tile.  The function is executed for every                          frame and for every tile, so it must be fast. |
| saturation| number\|function| <optional>| 1.0| The saturation of this layer.  1.0 uses the unmodified imagery color.                          Less than 1.0 reduces the saturation while greater than 1.0 increases it.                          This can either be a simple number or a function with the signaturefunction(frameState, layer, x, y, level).  The function is passed the                          current frame state, this layer, and the x, y, and level coordinates                          of the imagery tile for which the saturation is required, and it is expected to return                          the saturation value to use for the tile.  The function is executed for every                          frame and for every tile, so it must be fast. |
| gamma| number\|function| <optional>| 1.0| The gamma correction to apply to this layer.  1.0 uses the unmodified imagery color.                          This can either be a simple number or a function with the signaturefunction(frameState, layer, x, y, level).  The function is passed the                          current frame state, this layer, and the x, y, and level coordinates of the                          imagery tile for which the gamma is required, and it is expected to return                          the gamma value to use for the tile.  The function is executed for every                          frame and for every tile, so it must be fast. |
| splitDirection| SplitDirection\|function| <optional>| SplitDirection.NONE| TheSplitDirectionsplit to apply to this layer. |
| minificationFilter| TextureMinificationFilter| <optional>| TextureMinificationFilter.LINEAR| The                                    texture minification filter to apply to this layer. Possible values                                    areTextureMinificationFilter.LINEARandTextureMinificationFilter.NEAREST. |
| magnificationFilter| TextureMagnificationFilter| <optional>| TextureMagnificationFilter.LINEAR| The                                     texture minification filter to apply to this layer. Possible values                                     areTextureMagnificationFilter.LINEARandTextureMagnificationFilter.NEAREST. |
| show| boolean| <optional>| true| True if the layer is shown; otherwise, false. |
| maximumAnisotropy| number| <optional>| maximum supported| The maximum anisotropy level to use        for texture filtering.  If this parameter is not specified, the maximum anisotropy supported        by the WebGL stack will be used.  Larger values make the imagery look better in horizon        views. |
| minimumTerrainLevel| number| <optional>| | The minimum terrain level-of-detail at which to show this imagery layer,                 or undefined to show it at all levels.  Level zero is the least-detailed level. |
| maximumTerrainLevel| number| <optional>| | The maximum terrain level-of-detail at which to show this imagery layer,                 or undefined to show it at all levels.  Level zero is the least-detailed level. |
| cutoutRectangle| Rectangle| <optional>| | Cartographic rectangle for cutting out a portion of this ImageryLayer. |
| colorToAlpha| Color| <optional>| | Color to be used as alpha. |
| colorToAlphaThreshold| number| <optional>| 0.004| Threshold for color-to-alpha. |

### Cesium.ImageryLayer.ErrorEventCallback(err)
> A function that is called when an error occurs. 

| Name | Type | Description |
| --- | --- | --- |
 |
| err| Error| An object holding details about the error that occurred. |

### Cesium.ImageryLayer.ReadyEventCallback(provider)
> A function that is called when the provider has been created 

| Name | Type | Description |
| --- | --- | --- |
 |
| provider| ImageryProvider| The created imagery provider. |

### Cesium.ImageryLayer.WorldImageryConstructorOptions
> Initialization options for ImageryLayer.fromWorldImagery 

| Name | Type | Description |
| --- | --- | --- |
 |
| options.style| IonWorldImageryStyle| <optional>| IonWorldImageryStyle| The style of base imagery, only AERIAL, AERIAL_WITH_LABELS, and ROAD are currently supported. |


---

# ImageryProvider
### abstractnew Cesium.ImageryProvider()
> Provides imagery to be displayed on the surface of an ellipsoid.  This type describes an
interface and is not intended to be instantiated directly. 

## Members
### readonlycredit:Credit
> Gets the credit to display when this imagery provider is active.  Typically this is used to credit
the source of the imagery. 

### readonlyerrorEvent:Event
> Gets an event that is raised when the imagery provider encounters an asynchronous error.  By subscribing
to the event, you will be notified of the error and can potentially recover from it.  Event listeners
are passed an instance of TileProviderError . 

### readonlyhasAlphaChannel: boolean
> Gets a value indicating whether or not the images provided by this imagery provider
include an alpha channel.  If this property is false, an alpha channel, if present, will
be ignored.  If this property is true, any images without an alpha channel will be treated
as if their alpha is 1.0 everywhere.  When this property is false, memory usage
and texture upload time are reduced. 

### readonlymaximumLevel: number|undefined
> Gets the maximum level-of-detail that can be requested. 

### readonlyminimumLevel: number
> Gets the minimum level-of-detail that can be requested.  Generally,
a minimum level should only be used when the rectangle of the imagery is small
enough that the number of tiles at the minimum level is small.  An imagery
provider with more than a few tiles at the minimum level will lead to
rendering problems. 

### readonlyproxy:Proxy
> Gets the proxy used by this provider. 

### readonlyrectangle:Rectangle
> Gets the rectangle, in radians, of the imagery provided by the instance. 

### readonlytileDiscardPolicy:TileDiscardPolicy
> Gets the tile discard policy.  If not undefined, the discard policy is responsible
for filtering out "missing" tiles via its shouldDiscardImage function.  If this function
returns undefined, no tiles are filtered. 

### readonlytileHeight: number
> Gets the height of each tile, in pixels. 

### readonlytileWidth: number
> Gets the width of each tile, in pixels. 

### readonlytilingScheme:TilingScheme
> Gets the tiling scheme used by the provider. 

## Methods
### staticCesium.ImageryProvider.loadImage(imageryProvider, url)→Promise.<(ImageryTypes|CompressedTextureBuffer)>|undefined
> Loads an image from a given URL.  If the server referenced by the URL already has
too many requests pending, this function will instead return undefined, indicating
that the request should be retried later. 

| Name | Type | Description |
| --- | --- | --- |
 |
| imageryProvider| ImageryProvider| The imagery provider for the URL. |
| url| Resource\|string| The URL of the image. |

### getTileCredits(x, y, level)→Array.<Credit>
> Gets the credits to be displayed when a given tile is displayed. 

| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| The tile X coordinate. |
| y| number| The tile Y coordinate. |
| level| number| The tile level; |

### pickFeatures(x, y, level, longitude, latitude)→Promise.<Array.<ImageryLayerFeatureInfo>>|undefined
> Asynchronously determines what features, if any, are located at a given longitude and latitude within
a tile.
This function is optional, so it may not exist on all ImageryProviders. 

| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| The tile X coordinate. |
| y| number| The tile Y coordinate. |
| level| number| The tile level. |
| longitude| number| The longitude at which to pick features. |
| latitude| number| The latitude at which to pick features. |

### requestImage(x, y, level,request)→Promise.<ImageryTypes>|undefined
> Requests the image for a given tile. 

| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| The tile X coordinate. |
| y| number| The tile Y coordinate. |
| level| number| The tile level. |
| request| Request| optionalThe request object. Intended for internal use only. |


---

# TerrainProvider
### new Cesium.TerrainProvider()
> Provides terrain or other geometry for the surface of an ellipsoid.  The surface geometry is
organized into a pyramid of tiles according to a TilingScheme .  This type describes an
interface and is not intended to be instantiated directly. 

## Members
### staticCesium.TerrainProvider.heightmapTerrainQuality: number
> Specifies the quality of terrain created from heightmaps.  A value of 1.0 will
ensure that adjacent heightmap vertices are separated by no more than Globe.maximumScreenSpaceError screen pixels and will probably go very slowly.
A value of 0.5 will cut the estimated level zero geometric error in half, allowing twice the
screen pixels between adjacent heightmap vertices and thus rendering more quickly. 

### readonlyavailability:TileAvailability|undefined
> Gets an object that can be used to determine availability of terrain from this provider, such as
at points and in rectangles. This property may be undefined if availability
information is not available. 

### readonlycredit:Credit
> Gets the credit to display when this terrain provider is active.  Typically this is used to credit
the source of the terrain. 

### readonlyerrorEvent:Event.<TerrainProvider.ErrorEvent>
> Gets an event that is raised when the terrain provider encounters an asynchronous error.  By subscribing
to the event, you will be notified of the error and can potentially recover from it.  Event listeners
are passed an instance of TileProviderError . 

### readonlyhasVertexNormals: boolean
> Gets a value indicating whether or not the requested tiles include vertex normals. 

### readonlyhasWaterMask: boolean
> Gets a value indicating whether or not the provider includes a water mask.  The water mask
indicates which areas of the globe are water rather than land, so they can be rendered
as a reflective surface with animated waves. 

### readonlytilingScheme:TilingScheme
> Gets the tiling scheme used by the provider. 

## Methods
### staticCesium.TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(ellipsoid, tileImageWidth, numberOfTilesAtLevelZero)→number
> Determines an appropriate geometric error estimate when the geometry comes from a heightmap. 

| Name | Type | Description |
| --- | --- | --- |
 |
| ellipsoid| Ellipsoid| The ellipsoid to which the terrain is attached. |
| tileImageWidth| number| The width, in pixels, of the heightmap associated with a single tile. |
| numberOfTilesAtLevelZero| number| The number of tiles in the horizontal direction at tile level zero. |

### staticCesium.TerrainProvider.getRegularGridIndices(width, height)→Uint16Array|Uint32Array
> Gets a list of indices for a triangle mesh representing a regular grid.  Calling
this function multiple times with the same grid width and height returns the
same list of indices.  The total number of vertices must be less than or equal
to 65536. 

| Name | Type | Description |
| --- | --- | --- |
 |
| width| number| The number of vertices in the regular grid in the horizontal direction. |
| height| number| The number of vertices in the regular grid in the vertical direction. |

### getLevelMaximumGeometricError(level)→number
> Gets the maximum geometric error allowed in a tile at a given level. 

| Name | Type | Description |
| --- | --- | --- |
 |
| level| number| The tile level for which to get the maximum geometric error. |

### getTileDataAvailable(x, y, level)→boolean|undefined
> Determines whether data for a tile is available to be loaded. 

| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| The X coordinate of the tile for which to request geometry. |
| y| number| The Y coordinate of the tile for which to request geometry. |
| level| number| The level of the tile for which to request geometry. |

### loadTileDataAvailability(x, y, level)→undefined|Promise.<void>
> Makes sure we load availability data for a tile 

| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| The X coordinate of the tile for which to request geometry. |
| y| number| The Y coordinate of the tile for which to request geometry. |
| level| number| The level of the tile for which to request geometry. |

### requestTileGeometry(x, y, level,request)→Promise.<TerrainData>|undefined
> Requests the geometry for a given tile. The result must include terrain data and
may optionally include a water mask and an indication of which child tiles are available. 

| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| The X coordinate of the tile for which to request geometry. |
| y| number| The Y coordinate of the tile for which to request geometry. |
| level| number| The level of the tile for which to request geometry. |
| request| Request| optionalThe request object. Intended for internal use only. |

## Type Definitions
### Cesium.TerrainProvider.ErrorEvent(err)
> A function that is called when an error occurs. 

| Name | Type | Description |
| --- | --- | --- |
 |
| err| TileProviderError| An object holding details about the error that occurred. |


---

# CesiumTerrainProvider
### new Cesium.CesiumTerrainProvider(options)
> To construct a CesiumTerrainProvider, call CesiumTerrainProvider.fromIonAssetId or CesiumTerrainProvider.fromUrl . Do not call the constructor directly. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| CesiumTerrainProvider.ConstructorOptions| optionalAn object describing initialization options |

## Members
### readonlyavailability:TileAvailability|undefined
> Gets an object that can be used to determine availability of terrain from this provider, such as
at points and in rectangles. This property may be undefined if availability
information is not available. Note that this reflects tiles that are known to be available currently.
Additional tiles may be discovered to be available in the future, e.g. if availability information
exists deeper in the tree rather than it all being discoverable at the root. However, a tile that
is available now will not become unavailable in the future. 

### readonlycredit:Credit
> Gets the credit to display when this terrain provider is active.  Typically this is used to credit
the source of the terrain. 

### readonlyerrorEvent:Event
> Gets an event that is raised when the terrain provider encounters an asynchronous error.  By subscribing
to the event, you will be notified of the error and can potentially recover from it.  Event listeners
are passed an instance of TileProviderError . 

### readonlyhasMetadata: boolean
> Gets a value indicating whether or not the requested tiles include metadata. 

### readonlyhasVertexNormals: boolean
> Gets a value indicating whether or not the requested tiles include vertex normals. 

### readonlyhasWaterMask: boolean
> Gets a value indicating whether or not the provider includes a water mask.  The water mask
indicates which areas of the globe are water rather than land, so they can be rendered
as a reflective surface with animated waves. 

### readonlyrequestMetadata: boolean
> Boolean flag that indicates if the client should request metadata from the server.
Metadata is appended to the standard tile mesh data only if the client requests the metadata and
if the server provides a metadata. 

### readonlyrequestVertexNormals: boolean
> Boolean flag that indicates if the client should request vertex normals from the server.
Vertex normals data is appended to the standard tile mesh data only if the client requests the vertex normals and
if the server provides vertex normals. 

### readonlyrequestWaterMask: boolean
> Boolean flag that indicates if the client should request a watermask from the server.
Watermask data is appended to the standard tile mesh data only if the client requests the watermask and
if the server provides a watermask. 

### readonlytilingScheme:GeographicTilingScheme
> Gets the tiling scheme used by this provider. 

## Methods
### staticCesium.CesiumTerrainProvider.fromIonAssetId(assetId,options)→Promise.<CesiumTerrainProvider>
> Creates a TerrainProvider from a Cesium ion asset ID that accesses terrain data in a Cesium terrain format
Terrain formats can be one of the following: Quantized Mesh Height Map 

| Name | Type | Description |
| --- | --- | --- |
 |
| assetId| number| The Cesium ion asset id. |
| options| CesiumTerrainProvider.ConstructorOptions| optionalAn object describing initialization options. |

### staticCesium.CesiumTerrainProvider.fromUrl(url,options)→Promise.<CesiumTerrainProvider>
> Creates a TerrainProvider that accesses terrain data in a Cesium terrain format.
Terrain formats can be one of the following: Quantized Mesh Height Map 

| Name | Type | Description |
| --- | --- | --- |
 |
| url| Resource\|string\|Promise.<Resource>\|Promise.<string>| The URL of the Cesium terrain server. |
| options| CesiumTerrainProvider.ConstructorOptions| optionalAn object describing initialization options. |

### getLevelMaximumGeometricError(level)→number
> Gets the maximum geometric error allowed in a tile at a given level. 

| Name | Type | Description |
| --- | --- | --- |
 |
| level| number| The tile level for which to get the maximum geometric error. |

### getTileDataAvailable(x, y, level)→boolean|undefined
> Determines whether data for a tile is available to be loaded. 

| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| The X coordinate of the tile for which to request geometry. |
| y| number| The Y coordinate of the tile for which to request geometry. |
| level| number| The level of the tile for which to request geometry. |

### loadTileDataAvailability(x, y, level)→undefined|Promise.<void>
> Makes sure we load availability data for a tile 

| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| The X coordinate of the tile for which to request geometry. |
| y| number| The Y coordinate of the tile for which to request geometry. |
| level| number| The level of the tile for which to request geometry. |

### requestTileGeometry(x, y, level,request)→Promise.<TerrainData>|undefined
> Requests the geometry for a given tile. The result must include terrain data and
may optionally include a water mask and an indication of which child tiles are available. 

| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| The X coordinate of the tile for which to request geometry. |
| y| number| The Y coordinate of the tile for which to request geometry. |
| level| number| The level of the tile for which to request geometry. |
| request| Request| optionalThe request object. Intended for internal use only. |

## Type Definitions
### Cesium.CesiumTerrainProvider.ConstructorOptions
> Initialization options for the CesiumTerrainProvider constructor 

| Name | Type | Description |
| --- | --- | --- |
 |
| requestVertexNormals| boolean| <optional>| false| Flag that indicates if the client should request additional lighting information from the server, in the form of per vertex normals if available. |
| requestWaterMask| boolean| <optional>| false| Flag that indicates if the client should request per tile water masks from the server, if available. |
| requestMetadata| boolean| <optional>| true| Flag that indicates if the client should request per tile metadata from the server, if available. |
| ellipsoid| Ellipsoid| <optional>| Ellipsoid.default| The ellipsoid.  If not specified, the default ellipsoid is used. |
| credit| Credit\|string| <optional>| | A credit for the data source, which is displayed on the canvas. |


---

# IonResource
### new Cesium.IonResource(endpoint, endpointResource)
> A Resource instance that encapsulates Cesium ion asset access.
This object is normally not instantiated directly, use IonResource.fromAssetId . 

| Name | Type | Description |
| --- | --- | --- |
 |
| endpoint| object| The result of the Cesium ion asset endpoint service. |
| endpointResource| Resource| The original resource used to retrieve the endpoint. |

## Extends
## Members
### readonlycredits: Array.<Credit>
> Gets the credits required for attribution of the asset. 

### readonlyextension: string
> The file extension of the resource. 

### hasHeaders: boolean
> True if the Resource has request headers. This is equivalent to checking if the headers property has any keys. 

### headers: object
> Additional HTTP headers that will be sent with the request. 

### isBlobUri: boolean
> True if the Resource refers to a blob URI. 

### isCrossOriginUrl: boolean
> True if the Resource refers to a cross origin URL. 

### isDataUri: boolean
> True if the Resource refers to a data URI. 

### proxy:Proxy
> A proxy to be used when loading the resource. 

### readonlyqueryParameters: object
> Query parameters appended to the url. 

### request:Request
> A Request object that will be used. Intended for internal use only. 

### retryAttempts: number
> The number of times the retryCallback should be called before giving up. 

### retryCallback: function
> Function to call when a request for this resource fails. If it returns true or a Promise that resolves to true, the request will be retried. 

### readonlytemplateValues: object
> The key/value pairs used to replace template parameters in the url. 

### url: string
> The url to the resource with template values replaced, query string appended and encoded by proxy if one was set. 

## Methods
### staticCesium.IonResource.fromAssetId(assetId,options)→Promise.<IonResource>
> Asynchronously creates an instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| assetId| number| The Cesium ion asset id. |
| options| object| optionalAn object with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| accessToken| string| Ion.defaultAccessToken| optionalThe access token to use. |
| server| string\|Resource| Ion.defaultServer| optionalThe resource to the Cesium ion API server. |

### appendForwardSlash()
> Appends a forward slash to the URL. 

### appendQueryParameters(params)
> Combines the specified object and the existing query parameters. This allows you to add many parameters at once,
 as opposed to adding them one at a time to the queryParameters property. 

| Name | Type | Description |
| --- | --- | --- |
 |
| params| object| The query parameters |

### clone(result)→Resource
> Duplicates a Resource instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| result| Resource| optionalThe object onto which to store the result. |

### delete(options)→Promise.<any>|undefined
> Asynchronously deletes the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### fetch(options)→Promise.<any>|undefined
> Asynchronously loads the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. It's recommended that you use
the more specific functions eg. fetchJson, fetchBlob, etc. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### fetchArrayBuffer()→Promise.<ArrayBuffer>|undefined
> Asynchronously loads the resource as raw binary data.  Returns a promise that will resolve to
an ArrayBuffer once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

### fetchBlob()→Promise.<Blob>|undefined
> Asynchronously loads the given resource as a blob.  Returns a promise that will resolve to
a Blob once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

### fetchImage(options)→Promise.<(ImageBitmap|HTMLImageElement)>|undefined
> Asynchronously loads the given image resource.  Returns a promise that will resolve to
an ImageBitmap if preferImageBitmap is true and the browser supports createImageBitmap or otherwise an Image once loaded, or reject if the image failed to load. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalAn object with the following properties.
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| preferBlob| boolean| false| optionalIf true, we will load the image via a blob. |
| preferImageBitmap| boolean| false| optionalIf true, image will be decoded during fetch and anImageBitmapis returned. |
| flipY| boolean| false| optionalIf true, image will be vertically flipped during decode. Only applies if the browser supportscreateImageBitmap. |
| skipColorSpaceConversion| boolean| false| optionalIf true, any custom gamma or color profiles in the image will be ignored. Only applies if the browser supportscreateImageBitmap. |

### fetchJson()→Promise.<any>|undefined
> Asynchronously loads the given resource as JSON.  Returns a promise that will resolve to
a JSON object once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. This function
adds 'Accept: application/json,*/*;q=0.01' to the request headers, if not
already specified. 

### fetchJsonp(callbackParameterName)→Promise.<any>|undefined
> Requests a resource using JSONP. 

| Name | Type | Description |
| --- | --- | --- |
 |
| callbackParameterName| string| 'callback'| optionalThe callback parameter name that the server expects. |

### fetchText()→Promise.<string>|undefined
> Asynchronously loads the given resource as text.  Returns a promise that will resolve to
a String once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

### fetchXML()→Promise.<XMLDocument>|undefined
> Asynchronously loads the given resource as XML.  Returns a promise that will resolve to
an XML Document once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

### getBaseUri(includeQuery)→string
> Returns the base path of the Resource. 

| Name | Type | Description |
| --- | --- | --- |
 |
| includeQuery| boolean| false| optionalWhether or not to include the query string and fragment form the uri |

### getDerivedResource(options)→Resource
> Returns a resource relative to the current instance. All properties remain the same as the current instance unless overridden in options. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| An object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | optionalThe url that will be resolved relative to the url of the current instance. |
| queryParameters| object| | optionalAn object containing query parameters that will be combined with those of the current instance. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). These will be combined with those of the current instance. |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe function to call when loading the resource fails. |
| retryAttempts| number| | optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |
| preserveQueryParameters| boolean| false| optionalIf true, this will keep all query parameters from the current resource and derived resource. If false, derived parameters will replace those of the current resource. |

### getUrlComponent(query,proxy)→string
> Returns the url, optional with the query string and processed by a proxy. 

| Name | Type | Description |
| --- | --- | --- |
 |
| query| boolean| false| optionalIf true, the query string is included. |
| proxy| boolean| false| optionalIf true, the url is processed by the proxy object, if defined. |

### head(options)→Promise.<any>|undefined
> Asynchronously gets headers the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### options(options)→Promise.<any>|undefined
> Asynchronously gets options the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### patch(data,options)→Promise.<any>|undefined
> Asynchronously patches data to the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| data| object| Data that is posted with the resource. |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### post(data,options)→Promise.<any>|undefined
> Asynchronously posts data to the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| data| object| Data that is posted with the resource. |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| data| object| optionalData that is posted with the resource. |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### put(data,options)→Promise.<any>|undefined
> Asynchronously puts data to the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| data| object| Data that is posted with the resource. |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### setQueryParameters(params,useAsDefault)
> Combines the specified object and the existing query parameters. This allows you to add many parameters at once,
 as opposed to adding them one at a time to the queryParameters property. If a value is already set, it will be replaced with the new value. 

| Name | Type | Description |
| --- | --- | --- |
 |
| params| object| | The query parameters |
| useAsDefault| boolean| false| optionalIf true the params will be used as the default values, so they will only be set if they are undefined. |

### setTemplateValues(template,useAsDefault)
> Combines the specified object and the existing template values. This allows you to add many values at once,
 as opposed to adding them one at a time to the templateValues property. If a value is already set, it will become an array and the new value will be appended. 

| Name | Type | Description |
| --- | --- | --- |
 |
| template| object| | The template values |
| useAsDefault| boolean| false| optionalIf true the values will be used as the default values, so they will only be set if they are undefined. |

### toString()→string
> Override Object#toString so that implicit string conversion gives the
complete URL represented by this Resource. 


---

# Resource
### new Cesium.Resource(options)
> A resource that includes the location and any other parameters we need to retrieve it or create derived resources. It also provides the ability to retry requests. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| string\|Resource.ConstructorOptions| A url or an object describing initialization options |

## Members
### staticconstantCesium.Resource.DEFAULT:Resource
> A resource instance initialized to the current browser location 

### staticreadonlyCesium.Resource.isBlobSupported: boolean
> Returns true if blobs are supported. 

### readonlyextension: string
> The file extension of the resource. 

### hasHeaders: boolean
> True if the Resource has request headers. This is equivalent to checking if the headers property has any keys. 

### headers: object
> Additional HTTP headers that will be sent with the request. 

### isBlobUri: boolean
> True if the Resource refers to a blob URI. 

### isCrossOriginUrl: boolean
> True if the Resource refers to a cross origin URL. 

### isDataUri: boolean
> True if the Resource refers to a data URI. 

### proxy:Proxy
> A proxy to be used when loading the resource. 

### readonlyqueryParameters: object
> Query parameters appended to the url. 

### request:Request
> A Request object that will be used. Intended for internal use only. 

### retryAttempts: number
> The number of times the retryCallback should be called before giving up. 

### retryCallback: function
> Function to call when a request for this resource fails. If it returns true or a Promise that resolves to true, the request will be retried. 

### readonlytemplateValues: object
> The key/value pairs used to replace template parameters in the url. 

### url: string
> The url to the resource with template values replaced, query string appended and encoded by proxy if one was set. 

## Methods
### staticCesium.Resource.delete(options)→Promise.<any>|undefined
> Creates a Resource from a URL and calls delete() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| string\|object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| data| object| | optionalData that is posted with the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |
| responseType| string| | optionalThe type of response.  This controls the type of item returned. |
| overrideMimeType| string| | optionalOverrides the MIME type returned by the server. |

### staticCesium.Resource.fetch(options)→Promise.<any>|undefined
> Creates a Resource from a URL and calls fetch() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| string\|object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |
| responseType| string| | optionalThe type of response.  This controls the type of item returned. |
| overrideMimeType| string| | optionalOverrides the MIME type returned by the server. |

### staticCesium.Resource.fetchArrayBuffer(options)→Promise.<ArrayBuffer>|undefined
> Creates a Resource and calls fetchArrayBuffer() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| string\|object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |

### staticCesium.Resource.fetchBlob(options)→Promise.<Blob>|undefined
> Creates a Resource and calls fetchBlob() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| string\|object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |

### staticCesium.Resource.fetchImage(options)→Promise.<(ImageBitmap|HTMLImageElement)>|undefined
> Creates a Resource and calls fetchImage() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| string\|object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| flipY| boolean| false| optionalWhether to vertically flip the image during fetch and decode. Only applies when requesting an image and the browser supportscreateImageBitmap. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |
| preferBlob| boolean| false| optionalIf true, we will load the image via a blob. |
| preferImageBitmap| boolean| false| optionalIf true, image will be decoded during fetch and anImageBitmapis returned. |
| skipColorSpaceConversion| boolean| false| optionalIf true, any custom gamma or color profiles in the image will be ignored. Only applies when requesting an image and the browser supportscreateImageBitmap. |

### staticCesium.Resource.fetchJson(options)→Promise.<any>|undefined
> Creates a Resource and calls fetchJson() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| string\|object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |

### staticCesium.Resource.fetchJsonp(options)→Promise.<any>|undefined
> Creates a Resource from a URL and calls fetchJsonp() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| string\|object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |
| callbackParameterName| string| 'callback'| optionalThe callback parameter name that the server expects. |

### staticCesium.Resource.fetchText(options)→Promise.<string>|undefined
> Creates a Resource and calls fetchText() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| string\|object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |

### staticCesium.Resource.fetchXML(options)→Promise.<XMLDocument>|undefined
> Creates a Resource and calls fetchXML() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| string\|object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |

### staticCesium.Resource.head(options)→Promise.<any>|undefined
> Creates a Resource from a URL and calls head() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| string\|object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |
| responseType| string| | optionalThe type of response.  This controls the type of item returned. |
| overrideMimeType| string| | optionalOverrides the MIME type returned by the server. |

### staticCesium.Resource.options(options)→Promise.<any>|undefined
> Creates a Resource from a URL and calls options() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| string\|object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |
| responseType| string| | optionalThe type of response.  This controls the type of item returned. |
| overrideMimeType| string| | optionalOverrides the MIME type returned by the server. |

### staticCesium.Resource.patch(options)→Promise.<any>|undefined
> Creates a Resource from a URL and calls patch() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| data| object| | Data that is posted with the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |
| responseType| string| | optionalThe type of response.  This controls the type of item returned. |
| overrideMimeType| string| | optionalOverrides the MIME type returned by the server. |

### staticCesium.Resource.post(options)→Promise.<any>|undefined
> Creates a Resource from a URL and calls post() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| data| object| | Data that is posted with the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |
| responseType| string| | optionalThe type of response.  This controls the type of item returned. |
| overrideMimeType| string| | optionalOverrides the MIME type returned by the server. |

### staticCesium.Resource.put(options)→Promise.<any>|undefined
> Creates a Resource from a URL and calls put() on it. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| A url or an object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | The url of the resource. |
| data| object| | Data that is posted with the resource. |
| queryParameters| object| | optionalAn object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| 0| optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |
| responseType| string| | optionalThe type of response.  This controls the type of item returned. |
| overrideMimeType| string| | optionalOverrides the MIME type returned by the server. |

### appendForwardSlash()
> Appends a forward slash to the URL. 

### appendQueryParameters(params)
> Combines the specified object and the existing query parameters. This allows you to add many parameters at once,
 as opposed to adding them one at a time to the queryParameters property. 

| Name | Type | Description |
| --- | --- | --- |
 |
| params| object| The query parameters |

### clone(result)→Resource
> Duplicates a Resource instance. 

| Name | Type | Description |
| --- | --- | --- |
 |
| result| Resource| optionalThe object onto which to store the result. |

### delete(options)→Promise.<any>|undefined
> Asynchronously deletes the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### fetch(options)→Promise.<any>|undefined
> Asynchronously loads the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. It's recommended that you use
the more specific functions eg. fetchJson, fetchBlob, etc. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### fetchArrayBuffer()→Promise.<ArrayBuffer>|undefined
> Asynchronously loads the resource as raw binary data.  Returns a promise that will resolve to
an ArrayBuffer once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

### fetchBlob()→Promise.<Blob>|undefined
> Asynchronously loads the given resource as a blob.  Returns a promise that will resolve to
a Blob once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

### fetchImage(options)→Promise.<(ImageBitmap|HTMLImageElement)>|undefined
> Asynchronously loads the given image resource.  Returns a promise that will resolve to
an ImageBitmap if preferImageBitmap is true and the browser supports createImageBitmap or otherwise an Image once loaded, or reject if the image failed to load. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalAn object with the following properties.
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| preferBlob| boolean| false| optionalIf true, we will load the image via a blob. |
| preferImageBitmap| boolean| false| optionalIf true, image will be decoded during fetch and anImageBitmapis returned. |
| flipY| boolean| false| optionalIf true, image will be vertically flipped during decode. Only applies if the browser supportscreateImageBitmap. |
| skipColorSpaceConversion| boolean| false| optionalIf true, any custom gamma or color profiles in the image will be ignored. Only applies if the browser supportscreateImageBitmap. |

### fetchJson()→Promise.<any>|undefined
> Asynchronously loads the given resource as JSON.  Returns a promise that will resolve to
a JSON object once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. This function
adds 'Accept: application/json,*/*;q=0.01' to the request headers, if not
already specified. 

### fetchJsonp(callbackParameterName)→Promise.<any>|undefined
> Requests a resource using JSONP. 

| Name | Type | Description |
| --- | --- | --- |
 |
| callbackParameterName| string| 'callback'| optionalThe callback parameter name that the server expects. |

### fetchText()→Promise.<string>|undefined
> Asynchronously loads the given resource as text.  Returns a promise that will resolve to
a String once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

### fetchXML()→Promise.<XMLDocument>|undefined
> Asynchronously loads the given resource as XML.  Returns a promise that will resolve to
an XML Document once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

### getBaseUri(includeQuery)→string
> Returns the base path of the Resource. 

| Name | Type | Description |
| --- | --- | --- |
 |
| includeQuery| boolean| false| optionalWhether or not to include the query string and fragment form the uri |

### getDerivedResource(options)→Resource
> Returns a resource relative to the current instance. All properties remain the same as the current instance unless overridden in options. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| An object with the following properties
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| url| string| | optionalThe url that will be resolved relative to the url of the current instance. |
| queryParameters| object| | optionalAn object containing query parameters that will be combined with those of the current instance. |
| templateValues| object| | optionalKey/Value pairs that are used to replace template values (eg. {x}). These will be combined with those of the current instance. |
| headers| object| {}| optionalAdditional HTTP headers that will be sent. |
| proxy| Proxy| | optionalA proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| | optionalThe function to call when loading the resource fails. |
| retryAttempts| number| | optionalThe number of times the retryCallback should be called before giving up. |
| request| Request| | optionalA Request object that will be used. Intended for internal use only. |
| preserveQueryParameters| boolean| false| optionalIf true, this will keep all query parameters from the current resource and derived resource. If false, derived parameters will replace those of the current resource. |

### getUrlComponent(query,proxy)→string
> Returns the url, optional with the query string and processed by a proxy. 

| Name | Type | Description |
| --- | --- | --- |
 |
| query| boolean| false| optionalIf true, the query string is included. |
| proxy| boolean| false| optionalIf true, the url is processed by the proxy object, if defined. |

### head(options)→Promise.<any>|undefined
> Asynchronously gets headers the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### options(options)→Promise.<any>|undefined
> Asynchronously gets options the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### patch(data,options)→Promise.<any>|undefined
> Asynchronously patches data to the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| data| object| Data that is posted with the resource. |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### post(data,options)→Promise.<any>|undefined
> Asynchronously posts data to the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| data| object| Data that is posted with the resource. |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| data| object| optionalData that is posted with the resource. |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### put(data,options)→Promise.<any>|undefined
> Asynchronously puts data to the given resource.  Returns a promise that will resolve to
the result once loaded, or reject if the resource failed to load.  The data is loaded
using XMLHttpRequest, which means that in order to make requests to another origin,
the server must have Cross-Origin Resource Sharing (CORS) headers enabled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| data| object| Data that is posted with the resource. |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| responseType| string| optionalThe type of response.  This controls the type of item returned. |
| headers| object| optionalAdditional HTTP headers to send with the request, if any. |
| overrideMimeType| string| optionalOverrides the MIME type returned by the server. |

### setQueryParameters(params,useAsDefault)
> Combines the specified object and the existing query parameters. This allows you to add many parameters at once,
 as opposed to adding them one at a time to the queryParameters property. If a value is already set, it will be replaced with the new value. 

| Name | Type | Description |
| --- | --- | --- |
 |
| params| object| | The query parameters |
| useAsDefault| boolean| false| optionalIf true the params will be used as the default values, so they will only be set if they are undefined. |

### setTemplateValues(template,useAsDefault)
> Combines the specified object and the existing template values. This allows you to add many values at once,
 as opposed to adding them one at a time to the templateValues property. If a value is already set, it will become an array and the new value will be appended. 

| Name | Type | Description |
| --- | --- | --- |
 |
| template| object| | The template values |
| useAsDefault| boolean| false| optionalIf true the values will be used as the default values, so they will only be set if they are undefined. |

### toString()→string
> Override Object#toString so that implicit string conversion gives the
complete URL represented by this Resource. 

## Type Definitions
### Cesium.Resource.ConstructorOptions
> Initialization options for the Resource constructor 

| Name | Type | Description |
| --- | --- | --- |
 |
| url| string| | | The url of the resource. |
| queryParameters| object| <optional>| | An object containing query parameters that will be sent when retrieving the resource. |
| templateValues| object| <optional>| | Key/Value pairs that are used to replace template values (eg. {x}). |
| headers| object| <optional>| {}| Additional HTTP headers that will be sent. |
| proxy| Proxy| <optional>| | A proxy to be used when loading the resource. |
| retryCallback| Resource.RetryCallback| <optional>| | The Function to call when a request for this resource fails. If it returns true, the request will be retried. |
| retryAttempts| number| <optional>| 0| The number of times the retryCallback should be called before giving up. |
| request| Request| <optional>| | A Request object that will be used. Intended for internal use only. |
| parseUrl| boolean| <optional>| true| If true, parse the url for query parameters; otherwise store the url without change |

### Cesium.Resource.RetryCallback(resource,error)→boolean|Promise.<boolean>
> A function that returns the value of the property. 

| Name | Type | Description |
| --- | --- | --- |
 |
| resource| Resource| optionalThe resource that failed to load. |
| error| RequestErrorEvent| optionalThe error that occurred during the loading of the resource. |


---

# Global
## Members
### constantArcGisBaseMapType: number
> ArcGisBaseMapType enumerates the ArcGIS image tile layers that are supported by default. 

| Name | Type | Description |
| --- | --- | --- |
 |
| SATELLITE| number|  |
| OCEANS| number|  |
| HILLSHADE| number|  |

### constantArcType: number
> ArcType defines the path that should be taken connecting vertices. 

| Name | Type | Description |
| --- | --- | --- |
 |
| NONE| number| Straight line that does not conform to the surface of the ellipsoid. |
| GEODESIC| number| Follow geodesic path. |
| RHUMB| number| Follow rhumb or loxodrome path. |

### readonlyavailableLevels: number|undefined
> The number of levels of detail containing available tiles in the tileset. 

### constantAxis: number
> An enum describing the x, y, and z axes and helper conversion functions. 

| Name | Type | Description |
| --- | --- | --- |
 |
| X| number| Denotes the x-axis. |
| Y| number| Denotes the y-axis. |
| Z| number| Denotes the z-axis. |

### constantBingMapsStyle: number
> The types of imagery provided by Bing Maps. 

| Name | Type | Description |
| --- | --- | --- |
 |
| AERIAL| string| Aerial imagery. |
| AERIAL_WITH_LABELS| string| Aerial imagery with a road overlay. |
| AERIAL_WITH_LABELS_ON_DEMAND| string| Aerial imagery with a road overlay. |
| ROAD| string| Roads without additional imagery. |
| ROAD_ON_DEMAND| string| Roads without additional imagery. |
| CANVAS_DARK| string| A dark version of the road maps. |
| CANVAS_LIGHT| string| A lighter version of the road maps. |
| CANVAS_GRAY| string| A grayscale version of the road maps. |
| ORDNANCE_SURVEY| string| Ordnance Survey imagery. This imagery is visible only for the London, UK area. |
| COLLINS_BART| string| Collins Bart imagery. |

### constantBlendEquation: number
> Determines how two pixels' values are combined. 

| Name | Type | Description |
| --- | --- | --- |
 |
| ADD| number| Pixel values are added componentwise.  This is used in additive blending for translucency. |
| SUBTRACT| number| Pixel values are subtracted componentwise (source - destination).  This is used in alpha blending for translucency. |
| REVERSE_SUBTRACT| number| Pixel values are subtracted componentwise (destination - source). |
| MIN| number| Pixel values are given to the minimum function (min(source, destination)).  This equation operates on each pixel color component. |
| MAX| number| Pixel values are given to the maximum function (max(source, destination)).  This equation operates on each pixel color component. |

### constantBlendFunction: number
> Determines how blending factors are computed. 

| Name | Type | Description |
| --- | --- | --- |
 |
| ZERO| number| The blend factor is zero. |
| ONE| number| The blend factor is one. |
| SOURCE_COLOR| number| The blend factor is the source color. |
| ONE_MINUS_SOURCE_COLOR| number| The blend factor is one minus the source color. |
| DESTINATION_COLOR| number| The blend factor is the destination color. |
| ONE_MINUS_DESTINATION_COLOR| number| The blend factor is one minus the destination color. |
| SOURCE_ALPHA| number| The blend factor is the source alpha. |
| ONE_MINUS_SOURCE_ALPHA| number| The blend factor is one minus the source alpha. |
| DESTINATION_ALPHA| number| The blend factor is the destination alpha. |
| ONE_MINUS_DESTINATION_ALPHA| number| The blend factor is one minus the destination alpha. |
| CONSTANT_COLOR| number| The blend factor is the constant color. |
| ONE_MINUS_CONSTANT_COLOR| number| The blend factor is one minus the constant color. |
| CONSTANT_ALPHA| number| The blend factor is the constant alpha. |
| ONE_MINUS_CONSTANT_ALPHA| number| The blend factor is one minus the constant alpha. |
| SOURCE_ALPHA_SATURATE| number| The blend factor is the saturated source alpha. |

### constantBlendOption: number
> Determines how opaque and translucent parts of billboards, points, and labels are blended with the scene. 

| Name | Type | Description |
| --- | --- | --- |
 |
| OPAQUE| number| The billboards, points, or labels in the collection are completely opaque. |
| TRANSLUCENT| number| The billboards, points, or labels in the collection are completely translucent. |
| OPAQUE_AND_TRANSLUCENT| number| The billboards, points, or labels in the collection are both opaque and translucent. |

### constantCameraEventType: number
> Enumerates the available input for interacting with the camera. 

| Name | Type | Description |
| --- | --- | --- |
 |
| LEFT_DRAG| number| A left mouse button press followed by moving the mouse and releasing the button. |
| RIGHT_DRAG| number| A right mouse button press followed by moving the mouse and releasing the button. |
| MIDDLE_DRAG| number| A middle mouse button press followed by moving the mouse and releasing the button. |
| WHEEL| number| Scrolling the middle mouse button. |
| PINCH| number| A two-finger touch on a touch surface. |

### constantCesium3DTileColorBlendMode: number
> Defines how per-feature colors set from the Cesium API or declarative styling blend with the source colors from
the original feature, e.g. glTF material or per-point color in the tile. When REPLACE or MIX are used and the source color is a glTF material, the technique must assign the _3DTILESDIFFUSE semantic to the diffuse color parameter. Otherwise only HIGHLIGHT is supported. A feature whose color evaluates to white (1.0, 1.0, 1.0) is always rendered without color blending, regardless of the
tileset's color blend mode. "techniques": {
  "technique0": {
    "parameters": {
      "diffuse": {
        "semantic": "_3DTILESDIFFUSE",
        "type": 35666
      }
    }
  }
} 

| Name | Type | Description |
| --- | --- | --- |
 |
| HIGHLIGHT| number| Multiplies the source color by the feature color. |
| REPLACE| number| Replaces the source color with the feature color. |
| MIX| number| Blends the source color and feature color together. |

### constantCheck
> Contains functions for checking that supplied arguments are of a specified type
or meet specified conditions 

### constantClassificationType: number
> Whether a classification affects terrain, 3D Tiles or both. 

| Name | Type | Description |
| --- | --- | --- |
 |
| TERRAIN| number| Only terrain will be classified. |
| CESIUM_3D_TILE| number| Only 3D Tiles will be classified. |
| BOTH| number| Both terrain and 3D Tiles will be classified. |

### constantClockRange: number
> Constants used by Clock#tick to determine behavior
when Clock#startTime or Clock#stopTime is reached. 

| Name | Type | Description |
| --- | --- | --- |
 |
| UNBOUNDED| number| Clock#tickwill always advances the clock in its current direction. |
| CLAMPED| number| WhenClock#startTimeorClock#stopTimeis reached,Clock#tickwill not advanceClock#currentTimeany further. |
| LOOP_STOP| number| WhenClock#stopTimeis reached,Clock#tickwill advanceClock#currentTimeto the opposite end of the interval.  When time is moving backwards,Clock#tickwill not advance pastClock#startTime |

### constantClockStep: number
> Constants to determine how much time advances with each call
to Clock#tick . 

| Name | Type | Description |
| --- | --- | --- |
 |
| TICK_DEPENDENT| number| Clock#tickadvances the current time by a fixed step, which is the number of seconds specified byClock#multiplier. |
| SYSTEM_CLOCK_MULTIPLIER| number| Clock#tickadvances the current time by the amount of system time elapsed since the previous call multiplied byClock#multiplier. |
| SYSTEM_CLOCK| number| Clock#ticksets the clock to the current system time; ignoring all other settings. |

### constantCloudType: number
> Specifies the type of the cloud that is added to a CloudCollection in CloudCollection#add . 

| Name | Type | Description |
| --- | --- | --- |
 |
| CUMULUS| number| Cumulus cloud. |

### constantColorBlendMode: number
> Defines different modes for blending between a target color and a primitive's source color.

HIGHLIGHT multiplies the source color by the target color
REPLACE replaces the source color with the target color
MIX blends the source color and target color together 

| Name | Type | Description |
| --- | --- | --- |
 |
| HIGHLIGHT| number|  |
| REPLACE| number|  |
| MIX| number|  |

### constantComponentDatatype: number
> WebGL component datatypes.  Components are intrinsics,
which form attributes, which form vertices. 

| Name | Type | Description |
| --- | --- | --- |
 |
| BYTE| number| 8-bit signed byte corresponding togl.BYTEand the type of an element inInt8Array. |
| UNSIGNED_BYTE| number| 8-bit unsigned byte corresponding toUNSIGNED_BYTEand the type of an element inUint8Array. |
| SHORT| number| 16-bit signed short corresponding toSHORTand the type of an element inInt16Array. |
| UNSIGNED_SHORT| number| 16-bit unsigned short corresponding toUNSIGNED_SHORTand the type of an element inUint16Array. |
| INT| number| 32-bit signed int corresponding toINTand the type of an element inInt32Array. |
| UNSIGNED_INT| number| 32-bit unsigned int corresponding toUNSIGNED_INTand the type of an element inUint32Array. |
| FLOAT| number| 32-bit floating-point corresponding toFLOATand the type of an element inFloat32Array. |
| DOUBLE| number| 64-bit floating-point corresponding togl.DOUBLE(in Desktop OpenGL; this is not supported in WebGL, and is emulated in Cesium viaGeometryPipeline.encodeAttribute) and the type of an element inFloat64Array. |

### constantCornerType: number
> Style options for corners. 

| Name | Type | Description |
| --- | --- | --- |
 |
| ROUNDED| number| Corner has a smooth edge. |
| MITERED| number| Corner point is the intersection of adjacent edges. |
| BEVELED| number| Corner is clipped. |

### constantCullFace: number
> Determines which triangles, if any, are culled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| FRONT| number| Front-facing triangles are culled. |
| BACK| number| Back-facing triangles are culled. |
| FRONT_AND_BACK| number| Both front-facing and back-facing triangles are culled. |

### constantCustomShaderMode: string
> An enum describing how the CustomShader will be added to the
fragment shader. This determines how the shader interacts with the material. 

| Name | Type | Description |
| --- | --- | --- |
 |
| MODIFY_MATERIAL| string| The custom shader will be used to modify the results of the material stage before lighting is applied. |
| REPLACE_MATERIAL| string| The custom shader will be used instead of the material stage. This is a hint to optimize out the material processing code. |

### constantCustomShaderTranslucencyMode: number
> An enum for controling how CustomShader handles translucency compared with the original
primitive. 

| Name | Type | Description |
| --- | --- | --- |
 |
| INHERIT| number| Inherit translucency settings from the primitive's material. If the primitive used a translucent material, the custom shader will also be considered translucent. If the primitive used an opaque material, the custom shader will be considered opaque. |
| OPAQUE| number| Force the primitive to render the primitive as opaque, ignoring any material settings. |
| TRANSLUCENT| number| Force the primitive to render the primitive as translucent, ignoring any material settings. |

### constantDepthFunction: number
> Determines the function used to compare two depths for the depth test. 

| Name | Type | Description |
| --- | --- | --- |
 |
| NEVER| number| The depth test never passes. |
| LESS| number| The depth test passes if the incoming depth is less than the stored depth. |
| EQUAL| number| The depth test passes if the incoming depth is equal to the stored depth. |
| LESS_OR_EQUAL| number| The depth test passes if the incoming depth is less than or equal to the stored depth. |
| GREATER| number| The depth test passes if the incoming depth is greater than the stored depth. |
| NOT_EQUAL| number| The depth test passes if the incoming depth is not equal to the stored depth. |
| GREATER_OR_EQUAL| number| The depth test passes if the incoming depth is greater than or equal to the stored depth. |
| ALWAYS| number| The depth test always passes. |

### constantDONE: BoundingSphereState
> The BoundingSphere has been computed. 

### constantDynamicAtmosphereLightingType: number
> Atmosphere lighting effects (sky atmosphere, ground atmosphere, fog) can be
further modified with dynamic lighting from the sun or other light source
that changes over time. This enum determines which light source to use. 

| Name | Type | Description |
| --- | --- | --- |
 |
| NONE| number| Do not use dynamic atmosphere lighting. Atmosphere lighting effects will be lit from directly above rather than using the scene's light source. |
| SCENE_LIGHT| number| Use the scene's current light source for dynamic atmosphere lighting. |
| SUNLIGHT| number| Force the dynamic atmosphere lighting to always use the sunlight direction, even if the scene uses a different light source. |

### constantexcludesReverseAxis: Array.<number>
> EPSG codes known to not include reverse axis orders, and are within 4000-5000. 

### constantExtrapolationType: number
> Constants to determine how an interpolated value is extrapolated
when querying outside the bounds of available data. 

| Name | Type | Description |
| --- | --- | --- |
 |
| NONE| number| No extrapolation occurs. |
| HOLD| number| The first or last value is used when outside the range of sample data. |
| EXTRAPOLATE| number| The value is extrapolated. |

### constantFAILED: BoundingSphereState
> The BoundingSphere does not exist. 

### constantGeocodeType: number
> The type of geocoding to be performed by a GeocoderService . 

| Name | Type | Description |
| --- | --- | --- |
 |
| SEARCH| number| Perform a search where the input is considered complete. |
| AUTOCOMPLETE| number| Perform an auto-complete using partial input, typically reserved for providing possible results as a user is typing. |

### constantgeometryUpdaters: Array.<GeometryUpdater>
### constantHeightmapEncoding: number
> The encoding that is used for a heightmap 

| Name | Type | Description |
| --- | --- | --- |
 |
| NONE| number| No encoding |
| LERC| number| LERC encoding |

### constantHeightReference: number
> Represents the position relative to the terrain. 

| Name | Type | Description |
| --- | --- | --- |
 |
| NONE| number| The position is absolute. |
| CLAMP_TO_GROUND| number| The position is clamped to the terrain and 3D Tiles. When clamping to 3D Tilesets such as photorealistic 3D Tiles, ensure the tileset hasCesium3DTileset#enableCollisionset totrue. Otherwise, the entity may not be correctly clamped to the tileset surface. |
| RELATIVE_TO_GROUND| number| The position height is the height above the terrain and 3D Tiles. |
| CLAMP_TO_TERRAIN| number| The position is clamped to terain. |
| RELATIVE_TO_TERRAIN| number| The position height is the height above terrain. |
| CLAMP_TO_3D_TILE| number| The position is clamped to 3D Tiles. |
| RELATIVE_TO_3D_TILE| number| The position height is the height above 3D Tiles. |

### constantHorizontalOrigin: number
> The horizontal location of an origin relative to an object, e.g., a Billboard or Label .  For example, setting the horizontal origin to LEFT or RIGHT will display a billboard to the left or right (in screen space)
of the anchor position. 

| Name | Type | Description |
| --- | --- | --- |
 |
| CENTER| number| The origin is at the horizontal center of the object. |
| LEFT| number| The origin is on the left side of the object. |
| RIGHT| number| The origin is on the right side of the object. |

### constantincludesReverseAxis: Array.<number>
> EPSG codes known to include reverse axis orders, but are not within 4000-5000. 

### constantIndexDatatype: number
> Constants for WebGL index datatypes.  These corresponds to the type parameter of drawElements . 

| Name | Type | Description |
| --- | --- | --- |
 |
| UNSIGNED_BYTE| number| 8-bit unsigned byte corresponding toUNSIGNED_BYTEand the type of an element inUint8Array. |
| UNSIGNED_SHORT| number| 16-bit unsigned short corresponding toUNSIGNED_SHORTand the type of an element inUint16Array. |
| UNSIGNED_INT| number| 32-bit unsigned int corresponding toUNSIGNED_INTand the type of an element inUint32Array. |

### constantIntersect: number
> This enumerated type is used in determining where, relative to the frustum, an
object is located. The object can either be fully contained within the frustum (INSIDE),
partially inside the frustum and partially outside (INTERSECTING), or somewhere entirely
outside of the frustum's 6 planes (OUTSIDE). 

| Name | Type | Description |
| --- | --- | --- |
 |
| OUTSIDE| number| Represents that an object is not contained within the frustum. |
| INTERSECTING| number| Represents that an object intersects one of the frustum's planes. |
| INSIDE| number| Represents that an object is fully within the frustum. |

### constantIonGeocodeProviderType: string
> Underlying geocoding services that can be used via Cesium ion. 

| Name | Type | Description |
| --- | --- | --- |
 |
| GOOGLE| string| Google geocoder, for use with Google data. |
| BING| string| Bing geocoder, for use with Bing data. |
| DEFAULT| string| Use the default geocoder as set on the server.  Used when neither Bing or Google data is used. |

### constantIonWorldImageryStyle: number
> The types of imagery provided by createWorldImagery . 

| Name | Type | Description |
| --- | --- | --- |
 |
| AERIAL| number| Aerial imagery. |
| AERIAL_WITH_LABELS| number| Aerial imagery with a road overlay. |
| ROAD| number| Roads without additional imagery. |

### constantKeyboardEventModifier: number
> This enumerated type is for representing keyboard modifiers. These are keys
that are held down in addition to other event types. 

| Name | Type | Description |
| --- | --- | --- |
 |
| SHIFT| number| Represents the shift key being held down. |
| CTRL| number| Represents the control key being held down. |
| ALT| number| Represents the alt key being held down. |

### constantLabelStyle: number
> Describes how to draw a label. 

| Name | Type | Description |
| --- | --- | --- |
 |
| FILL| number| Fill the text of the label, but do not outline. |
| OUTLINE| number| Outline the text of the label, but do not fill. |
| FILL_AND_OUTLINE| number| Fill and outline the text of the label. |

### constantLightingModel: number
> The lighting model to use for lighting a Model . 

| Name | Type | Description |
| --- | --- | --- |
 |
| UNLIT| number| Use unlit shading, i.e. skip lighting calculations. The model's diffuse color (assumed to be linear RGB, not sRGB) is used directly when computingout_FragColor. The alpha mode is still applied. |
| PBR| number| Use physically-based rendering lighting calculations. This includes both PBR metallic roughness and PBR specular glossiness. Image-based lighting is also applied when possible. |

### constantMapMode2D: number
> Describes how the map will operate in 2D. 

| Name | Type | Description |
| --- | --- | --- |
 |
| ROTATE| number| The 2D map can be rotated about the z axis. |
| INFINITE_SCROLL| number| The 2D map can be scrolled infinitely in the horizontal direction. |

### readonlymetadata: Array.<Int8Array>|Array.<Uint8Array>|Array.<Int16Array>|Array.<Uint16Array>|Array.<Int32Array>|Array.<Uint32Array>|Array.<Float32Array>|Array.<Float64Array>
> The metadata for this voxel content.
The metadata is an array of typed arrays, one for each field.
The data for one field is a flattened 3D array ordered by X, then Y, then Z. 

### constantMetadataComponentType: string
> An enum of metadata component types. 

| Name | Type | Description |
| --- | --- | --- |
 |
| INT8| string| An 8-bit signed integer |
| UINT8| string| An 8-bit unsigned integer |
| INT16| string| A 16-bit signed integer |
| UINT16| string| A 16-bit unsigned integer |
| INT32| string| A 32-bit signed integer |
| UINT32| string| A 32-bit unsigned integer |
| INT64| string| A 64-bit signed integer. |
| UINT64| string| A 64-bit signed integer. |
| FLOAT32| string| A 32-bit (single precision) floating point number |
| FLOAT64| string| A 64-bit (double precision) floating point number |

### constantMetadataType: string
> An enum of metadata types. These metadata types are containers containing
one or more components of type MetadataComponentType 

| Name | Type | Description |
| --- | --- | --- |
 |
| SCALAR| string| A single component |
| VEC2| string| A vector with two components |
| VEC3| string| A vector with three components |
| VEC4| string| A vector with four components |
| MAT2| string| A 2x2 matrix, stored in column-major format. |
| MAT3| string| A 3x3 matrix, stored in column-major format. |
| MAT4| string| A 4x4 matrix, stored in column-major format. |
| BOOLEAN| string| A boolean (true/false) value |
| STRING| string| A UTF-8 encoded string value |
| ENUM| string| An enumerated value. This type is used in conjunction with aMetadataEnumto describe the valid values. |

### constantModelAnimationLoop: number
> Determines if and how a glTF animation is looped. 

| Name | Type | Description |
| --- | --- | --- |
 |
| NONE| number| Play the animation once; do not loop it. |
| REPEAT| number| Loop the animation playing it from the start immediately after it stops. |
| MIRRORED_REPEAT| number| Loop the animation.  First, playing it forward, then in reverse, then forward, and so on. |

### readonlyof:Scene|undefined
> The CesiumWidget#scene that the tileset will be rendered in, required for tilesets that specify a heightReference value for clamping 3D Tiles vector data content- like points, lines, and labels- to terrain or 3D tiles. 

### constantPENDING: BoundingSphereState
> The BoundingSphere is still being computed. 

### constantPixelDatatype: number
> The data type of a pixel. 

| Name | Type | Description |
| --- | --- | --- |
 |
| UNSIGNED_BYTE| number|  |
| UNSIGNED_SHORT| number|  |
| UNSIGNED_INT| number|  |
| FLOAT| number|  |
| HALF_FLOAT| number|  |
| UNSIGNED_INT_24_8| number|  |
| UNSIGNED_SHORT_4_4_4_4| number|  |
| UNSIGNED_SHORT_5_5_5_1| number|  |
| UNSIGNED_SHORT_5_6_5| number|  |

### constantPixelFormat: number
> The format of a pixel, i.e., the number of components it has and what they represent. 

| Name | Type | Description |
| --- | --- | --- |
 |
| DEPTH_COMPONENT| number| A pixel format containing a depth value. |
| DEPTH_STENCIL| number| A pixel format containing a depth and stencil value, most often used withPixelDatatype.UNSIGNED_INT_24_8. |
| ALPHA| number| A pixel format containing an alpha channel. |
| RED| number| A pixel format containing a red channel |
| RG| number| A pixel format containing red and green channels. |
| RGB| number| A pixel format containing red, green, and blue channels. |
| RGBA| number| A pixel format containing red, green, blue, and alpha channels. |
| RED_INTEGER| number| A pixel format containing a red channel as an integer. |
| RG_INTEGER| number| A pixel format containing red and green channels as integers. |
| RGB_INTEGER| number| A pixel format containing red, green, and blue channels as integers. |
| RGBA_INTEGER| number| A pixel format containing red, green, blue, and alpha channels as integers. |
| LUMINANCE| number| A pixel format containing a luminance (intensity) channel. |
| LUMINANCE_ALPHA| number| A pixel format containing luminance (intensity) and alpha channels. |
| RGB_DXT1| number| A pixel format containing red, green, and blue channels that is DXT1 compressed. |
| RGBA_DXT1| number| A pixel format containing red, green, blue, and alpha channels that is DXT1 compressed. |
| RGBA_DXT3| number| A pixel format containing red, green, blue, and alpha channels that is DXT3 compressed. |
| RGBA_DXT5| number| A pixel format containing red, green, blue, and alpha channels that is DXT5 compressed. |
| RGB_PVRTC_4BPPV1| number| A pixel format containing red, green, and blue channels that is PVR 4bpp compressed. |
| RGB_PVRTC_2BPPV1| number| A pixel format containing red, green, and blue channels that is PVR 2bpp compressed. |
| RGBA_PVRTC_4BPPV1| number| A pixel format containing red, green, blue, and alpha channels that is PVR 4bpp compressed. |
| RGBA_PVRTC_2BPPV1| number| A pixel format containing red, green, blue, and alpha channels that is PVR 2bpp compressed. |
| RGBA_ASTC| number| A pixel format containing red, green, blue, and alpha channels that is ASTC compressed. |
| RGB_ETC1| number| A pixel format containing red, green, and blue channels that is ETC1 compressed. |
| RGB8_ETC2| number| A pixel format containing red, green, and blue channels that is ETC2 compressed. |
| RGBA8_ETC2_EAC| number| A pixel format containing red, green, blue, and alpha channels that is ETC2 compressed. |
| RGBA_BC7| number| A pixel format containing red, green, blue, and alpha channels that is BC7 compressed. |

### constantPostProcessStageSampleMode: number
> Determines how input texture to a PostProcessStage is sampled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| NEAREST| number| Samples the texture by returning the closest texel. |
| LINEAR| number| Samples the texture through bi-linear interpolation of the four nearest texels. |

### constantPrimitiveType: number
> The type of a geometric primitive, i.e., points, lines, and triangles. 

| Name | Type | Description |
| --- | --- | --- |
 |
| POINTS| number| Points primitive where each vertex (or index) is a separate point. |
| LINES| number| Lines primitive where each two vertices (or indices) is a line segment.  Line segments are not necessarily connected. |
| LINE_LOOP| number| Line loop primitive where each vertex (or index) after the first connects a line to the previous vertex, and the last vertex implicitly connects to the first. |
| LINE_STRIP| number| Line strip primitive where each vertex (or index) after the first connects a line to the previous vertex. |
| TRIANGLES| number| Triangles primitive where each three vertices (or indices) is a triangle.  Triangles do not necessarily share edges. |
| TRIANGLE_STRIP| number| Triangle strip primitive where each vertex (or index) after the first two connect to the previous two vertices forming a triangle.  For example, this can be used to model a wall. |
| TRIANGLE_FAN| number| Triangle fan primitive where each vertex (or index) after the first two connect to the previous vertex and the first vertex forming a triangle.  For example, this can be used to model a cone or circle. |

### constantReferenceFrame: number
> Constants for identifying well-known reference frames. 

| Name | Type | Description |
| --- | --- | --- |
 |
| FIXED| number| The fixed frame. |
| INERTIAL| number| The inertial frame. |

### constantRequestState: number
> State of the request. 

| Name | Type | Description |
| --- | --- | --- |
 |
| UNISSUED| number| Initial unissued state. |
| ISSUED| number| Issued but not yet active. Will become active when open slots are available. |
| ACTIVE| number| Actual http request has been sent. |
| RECEIVED| number| Request completed successfully. |
| CANCELLED| number| Request was cancelled, either explicitly or automatically because of low priority. |
| FAILED| number| Request failed. |

### constantRequestType: number
> An enum identifying the type of request. Used for finer grained logging and priority sorting. 

| Name | Type | Description |
| --- | --- | --- |
 |
| TERRAIN| number| Terrain request. |
| IMAGERY| number| Imagery request. |
| TILES3D| number| 3D Tiles request. |
| OTHER| number| Other request. |

### constantSceneMode: number
> Indicates if the scene is viewed in 3D, 2D, or 2.5D Columbus view. 

| Name | Type | Description |
| --- | --- | --- |
 |
| MORPHING| number| Morphing between mode, e.g., 3D to 2D. |
| COLUMBUS_VIEW| number| Columbus View mode.  A 2.5D perspective view where the map is laid out flat and objects with non-zero height are drawn above it. |
| SCENE2D| number| 2D mode.  The map is viewed top-down with an orthographic projection. |
| SCENE3D| number| 3D mode.  A traditional 3D perspective view of the globe. |

### constantScreenSpaceEventType: number
> This enumerated type is for classifying mouse events: down, up, click, double click, move and move while a button is held down. 

| Name | Type | Description |
| --- | --- | --- |
 |
| LEFT_DOWN| number| Represents a mouse left button down event. |
| LEFT_UP| number| Represents a mouse left button up event. |
| LEFT_CLICK| number| Represents a mouse left click event. |
| LEFT_DOUBLE_CLICK| number| Represents a mouse left double click event. |
| RIGHT_DOWN| number| Represents a mouse left button down event. |
| RIGHT_UP| number| Represents a mouse right button up event. |
| RIGHT_CLICK| number| Represents a mouse right click event. |
| MIDDLE_DOWN| number| Represents a mouse middle button down event. |
| MIDDLE_UP| number| Represents a mouse middle button up event. |
| MIDDLE_CLICK| number| Represents a mouse middle click event. |
| MOUSE_MOVE| number| Represents a mouse move event. |
| WHEEL| number| Represents a mouse wheel event. |
| PINCH_START| number| Represents the start of a two-finger event on a touch surface. |
| PINCH_END| number| Represents the end of a two-finger event on a touch surface. |
| PINCH_MOVE| number| Represents a change of a two-finger event on a touch surface. |

### constantSensorVolumePortionToDisplay: number
> Constants used to indicated what part of the sensor volume to display. 

| Name | Type | Description |
| --- | --- | --- |
 |
| COMPLETE| number| 0x0000.  Display the complete sensor volume. |
| BELOW_ELLIPSOID_HORIZON| number| 0x0001.  Display the portion of the sensor volume that lies below the true horizon of the ellipsoid. |
| ABOVE_ELLIPSOID_HORIZON| number| 0x0002.  Display the portion of the sensor volume that lies above the true horizon of the ellipsoid. |

### constantShadowMode: number
> Specifies whether the object casts or receives shadows from light sources when
shadows are enabled. 

| Name | Type | Description |
| --- | --- | --- |
 |
| DISABLED| number| The object does not cast or receive shadows. |
| ENABLED| number| The object casts and receives shadows. |
| CAST_ONLY| number| The object casts shadows only. |
| RECEIVE_ONLY| number| The object receives shadows only. |

### show: boolean
> Determines if the sky box will be shown. 

### constantSplitDirection: number
> The direction to display a primitive or ImageryLayer relative to the Scene#splitPosition . 

| Name | Type | Description |
| --- | --- | --- |
 |
| LEFT| number| Display the primitive or ImageryLayer to the left of theScene#splitPosition. |
| NONE| number| Always display the primitive or ImageryLayer. |
| RIGHT| number| Display the primitive or ImageryLayer to the right of theScene#splitPosition. |

### constantStencilFunction: number
> Determines the function used to compare stencil values for the stencil test. 

| Name | Type | Description |
| --- | --- | --- |
 |
| NEVER| number| The stencil test never passes. |
| LESS| number| The stencil test passes when the masked reference value is less than the masked stencil value. |
| EQUAL| number| The stencil test passes when the masked reference value is equal to the masked stencil value. |
| LESS_OR_EQUAL| number| The stencil test passes when the masked reference value is less than or equal to the masked stencil value. |
| GREATER| number| The stencil test passes when the masked reference value is greater than the masked stencil value. |
| NOT_EQUAL| number| The stencil test passes when the masked reference value is not equal to the masked stencil value. |
| GREATER_OR_EQUAL| number| The stencil test passes when the masked reference value is greater than or equal to the masked stencil value. |
| ALWAYS| number| The stencil test always passes. |

### constantStencilOperation: number
> Determines the action taken based on the result of the stencil test. 

| Name | Type | Description |
| --- | --- | --- |
 |
| ZERO| number| Sets the stencil buffer value to zero. |
| KEEP| number| Does not change the stencil buffer. |
| REPLACE| number| Replaces the stencil buffer value with the reference value. |
| INCREMENT| number| Increments the stencil buffer value, clamping to unsigned byte. |
| DECREMENT| number| Decrements the stencil buffer value, clamping to zero. |
| INVERT| number| Bitwise inverts the existing stencil buffer value. |
| INCREMENT_WRAP| number| Increments the stencil buffer value, wrapping to zero when exceeding the unsigned byte range. |
| DECREMENT_WRAP| number| Decrements the stencil buffer value, wrapping to the maximum unsigned byte instead of going below zero. |

### constantStorageType: string
> An enum of storage types for covariance information.

This reflects the `gltfGpmLocal.storageType` definition of the NGA_gpm_local glTF extension. 

| Name | Type | Description |
| --- | --- | --- |
 |
| Direct| string| Store the full error covariance of the anchor points, to include the cross-covariance terms |
| Indirect| string| A full covariance matrix is stored for each of the anchor points. However, in this case the cross-covariance terms are not directly stored, but can be computed by a set of spatial correlation function parameters which are stored in the metadata. |

### constantStripeOrientation: number
> Defined the orientation of stripes in StripeMaterialProperty . 

| Name | Type | Description |
| --- | --- | --- |
 |
| HORIZONTAL| number| Horizontal orientation. |
| VERTICAL| number| Vertical orientation. |

### constantSVG_MAX_SIZE_PX
> Arbitrary limit on allocated SVG size, in pixels. Raster images use image resolution. 

### constantTextureMagnificationFilter: number
> Enumerates all possible filters used when magnifying WebGL textures. 

| Name | Type | Description |
| --- | --- | --- |
 |
| NEAREST| number| Samples the texture by returning the closest pixel. |
| LINEAR| number| Samples the texture through bi-linear interpolation of the four nearest pixels. This produces smoother results thanNEARESTfiltering. |

### constantTextureMinificationFilter: number
> Enumerates all possible filters used when minifying WebGL textures. 

| Name | Type | Description |
| --- | --- | --- |
 |
| NEAREST| number| Samples the texture by returning the closest pixel. |
| LINEAR| number| Samples the texture through bi-linear interpolation of the four nearest pixels. This produces smoother results thanNEARESTfiltering. |
| NEAREST_MIPMAP_NEAREST| number| Selects the nearest mip level and applies nearest sampling within that level.Requires that the texture has a mipmap. The mip level is chosen by the view angle and screen-space size of the texture. |
| LINEAR_MIPMAP_NEAREST| number| Selects the nearest mip level and applies linear sampling within that level.Requires that the texture has a mipmap. The mip level is chosen by the view angle and screen-space size of the texture. |
| NEAREST_MIPMAP_LINEAR| number| Read texture values with nearest sampling from two adjacent mip levels and linearly interpolate the results.This option provides a good balance of visual quality and speed when sampling from a mipmapped texture.Requires that the texture has a mipmap. The mip level is chosen by the view angle and screen-space size of the texture. |
| LINEAR_MIPMAP_LINEAR| number| Read texture values with linear sampling from two adjacent mip levels and linearly interpolate the results.This option provides a good balance of visual quality and speed when sampling from a mipmapped texture.Requires that the texture has a mipmap. The mip level is chosen by the view angle and screen-space size of the texture. |

### constantTILE_SIZE
> Creates a spatial hash key for the given longitude, latitude, and tile level.
The precision is adjusted based on the tile level and extent to achieve finer precision at higher levels.

This function calculates the spatial hash key by first determining the precision at the given tile for the current maximum screenspace error (MAX_ERROR_PX),
and then rounding the longitude and latitude to that precision for consistency.

The steps for computing the level precision are as follows:

1. Compute the resolution (meters per pixel) at the given level:
     level_resolution_m = (2 * PI * RADIUS) / (2^level * TILE_SIZE)

2. Compute the target precision in meters:
     level_precision_m = level_resolution_m * MAX_ERROR_PX

3. Compute the target precision to radians:
     level_precision_rad = level_precision_m / BODY_RADIUS

This simplifies to:
     level_precision_rad = (2 * PI * MAX_ERROR_PX) / (2^level * TILE_SIZE)
which can also be written as:
     level_precision_rad = (PI * MAX_ERROR_PX) / (2^(level-1) * TILE_SIZE)

The computed level_precision_rad is then used to round the input longitude and latitude,
ensuring that positions that fall within the same spatial bin produce the same hash key.

The constants below are computed once since they are fixed for the given configuration. 

### constantTimeStandard: number
> Provides the type of time standards which JulianDate can take as input. 

| Name | Type | Description |
| --- | --- | --- |
 |
| UTC| number| Represents the coordinated Universal Time (UTC) time standard.  UTC is related to TAI according to the relationshipUTC = TAI - deltaTwheredeltaTis the number of leap seconds which have been introduced as of the time in TAI. |
| TAI| number| Represents the International Atomic Time (TAI) time standard. TAI is the principal time standard to which the other time standards are related. |

### constantTonemapper: string
> A tonemapping algorithm when rendering with high dynamic range. 

| Name | Type | Description |
| --- | --- | --- |
 |
| REINHARD| string| Use the Reinhard tonemapping. |
| MODIFIED_REINHARD| string| Use the modified Reinhard tonemapping. |
| FILMIC| string| Use the Filmic tonemapping. |
| ACES| string| Use the ACES tonemapping. |
| PBR_NEUTRAL| string| Use the PBR Neutral tonemappingfrom Khronos. |

### constantTrackingReferenceFrame: number
> Constants for identifying well-known tracking reference frames. 

| Name | Type | Description |
| --- | --- | --- |
 |
| AUTODETECT| number| Auto-detect algorithm. The reference frame used to track the Entity will be automatically selected based on its trajectory: near-surface slow moving objects will be tracked in the entity's local east-north-up reference frame, while faster objects like satellites will use VVLH (Vehicle Velocity, Local Horizontal). |
| ENU| number| The entity's local East-North-Up reference frame. |
| INERTIAL| number| The entity's inertial reference frame. If entity has no defined orientation property, it falls back to auto-detect algorithm. |
| VELOCITY| number| The entity's inertial reference frame with orientation fixed to itsVelocityOrientationProperty, ignoring its own orientation. |

### constantUniformType: string
> An enum of the basic GLSL uniform types. These can be used with CustomShader to declare user-defined uniforms. 

| Name | Type | Description |
| --- | --- | --- |
 |
| FLOAT| string| A single floating point value. |
| VEC2| string| A vector of 2 floating point values. |
| VEC3| string| A vector of 3 floating point values. |
| VEC4| string| A vector of 4 floating point values. |
| INT| string| A single integer value |
| INT_VEC2| string| A vector of 2 integer values. |
| INT_VEC3| string| A vector of 3 integer values. |
| INT_VEC4| string| A vector of 4 integer values. |
| BOOL| string| A single boolean value. |
| BOOL_VEC2| string| A vector of 2 boolean values. |
| BOOL_VEC3| string| A vector of 3 boolean values. |
| BOOL_VEC4| string| A vector of 4 boolean values. |
| MAT2| string| A 2x2 matrix of floating point values. |
| MAT3| string| A 3x3 matrix of floating point values. |
| MAT4| string| A 4x4 matrix of floating point values. |
| SAMPLER_2D| string| A 2D sampled texture. |
| SAMPLER_CUBE| string|  |

### constantVaryingType: string
> An enum for the GLSL varying types. These can be used for declaring varyings
in CustomShader 

| Name | Type | Description |
| --- | --- | --- |
 |
| FLOAT| string| A single floating point value. |
| VEC2| string| A vector of 2 floating point values. |
| VEC3| string| A vector of 3 floating point values. |
| VEC4| string| A vector of 4 floating point values. |
| MAT2| string| A 2x2 matrix of floating point values. |
| MAT3| string| A 3x3 matrix of floating point values. |
| MAT4| string| A 4x4 matrix of floating point values. |

### constantVerticalOrigin: number
> The vertical location of an origin relative to an object, e.g., a Billboard or Label .  For example, setting the vertical origin to TOP or BOTTOM will display a billboard above or below (in screen space)
the anchor position. 

| Name | Type | Description |
| --- | --- | --- |
 |
| CENTER| number| The origin is at the vertical center betweenBASELINEandTOP. |
| BOTTOM| number| The origin is at the bottom of the object. |
| BASELINE| number| If the object contains text, the origin is at the baseline of the text, else the origin is at the bottom of the object. |
| TOP| number| The origin is at the top of the object. |

### constantVisibility: number
> This enumerated type is used in determining to what extent an object, the occludee,
is visible during horizon culling. An occluder may fully block an occludee, in which case
it has no visibility, may partially block an occludee from view, or may not block it at all,
leading to full visibility. 

| Name | Type | Description |
| --- | --- | --- |
 |
| NONE| number| Represents that no part of an object is visible. |
| PARTIAL| number| Represents that part, but not all, of an object is visible |
| FULL| number| Represents that an object is visible in its entirety. |

### constantVoxelShapeType: string
> An enum of voxel shapes. The shape controls how the voxel grid is mapped to 3D space. 

| Name | Type | Description |
| --- | --- | --- |
 |
| BOX| string| A box shape. |
| ELLIPSOID| string| An ellipsoid shape. |
| CYLINDER| string| A cylinder shape. |

### constantWebGLConstants: number
> Enum containing WebGL Constant values by name.
for use without an active WebGL context, or in cases where certain constants are unavailable using the WebGL context
(For example, in Safari 9 ).

These match the constants from the WebGL 1.0 and WebGL 2.0 specifications. 

| Name | Type | Description |
| --- | --- | --- |
 |
| DEPTH_BUFFER_BIT| number|  |
| STENCIL_BUFFER_BIT| number|  |
| COLOR_BUFFER_BIT| number|  |
| POINTS| number|  |
| LINES| number|  |
| LINE_LOOP| number|  |
| LINE_STRIP| number|  |
| TRIANGLES| number|  |
| TRIANGLE_STRIP| number|  |
| TRIANGLE_FAN| number|  |
| ZERO| number|  |
| ONE| number|  |
| SRC_COLOR| number|  |
| ONE_MINUS_SRC_COLOR| number|  |
| SRC_ALPHA| number|  |
| ONE_MINUS_SRC_ALPHA| number|  |
| DST_ALPHA| number|  |
| ONE_MINUS_DST_ALPHA| number|  |
| DST_COLOR| number|  |
| ONE_MINUS_DST_COLOR| number|  |
| SRC_ALPHA_SATURATE| number|  |
| FUNC_ADD| number|  |
| BLEND_EQUATION| number|  |
| BLEND_EQUATION_RGB| number|  |
| BLEND_EQUATION_ALPHA| number|  |
| FUNC_SUBTRACT| number|  |
| FUNC_REVERSE_SUBTRACT| number|  |
| BLEND_DST_RGB| number|  |
| BLEND_SRC_RGB| number|  |
| BLEND_DST_ALPHA| number|  |
| BLEND_SRC_ALPHA| number|  |
| CONSTANT_COLOR| number|  |
| ONE_MINUS_CONSTANT_COLOR| number|  |
| CONSTANT_ALPHA| number|  |
| ONE_MINUS_CONSTANT_ALPHA| number|  |
| BLEND_COLOR| number|  |
| ARRAY_BUFFER| number|  |
| ELEMENT_ARRAY_BUFFER| number|  |
| ARRAY_BUFFER_BINDING| number|  |
| ELEMENT_ARRAY_BUFFER_BINDING| number|  |
| STREAM_DRAW| number|  |
| STATIC_DRAW| number|  |
| DYNAMIC_DRAW| number|  |
| BUFFER_SIZE| number|  |
| BUFFER_USAGE| number|  |
| CURRENT_VERTEX_ATTRIB| number|  |
| FRONT| number|  |
| BACK| number|  |
| FRONT_AND_BACK| number|  |
| CULL_FACE| number|  |
| BLEND| number|  |
| DITHER| number|  |
| STENCIL_TEST| number|  |
| DEPTH_TEST| number|  |
| SCISSOR_TEST| number|  |
| POLYGON_OFFSET_FILL| number|  |
| SAMPLE_ALPHA_TO_COVERAGE| number|  |
| SAMPLE_COVERAGE| number|  |
| NO_ERROR| number|  |
| INVALID_ENUM| number|  |
| INVALID_VALUE| number|  |
| INVALID_OPERATION| number|  |
| OUT_OF_MEMORY| number|  |
| CW| number|  |
| CCW| number|  |
| LINE_WIDTH| number|  |
| ALIASED_POINT_SIZE_RANGE| number|  |
| ALIASED_LINE_WIDTH_RANGE| number|  |
| CULL_FACE_MODE| number|  |
| FRONT_FACE| number|  |
| DEPTH_RANGE| number|  |
| DEPTH_WRITEMASK| number|  |
| DEPTH_CLEAR_VALUE| number|  |
| DEPTH_FUNC| number|  |
| STENCIL_CLEAR_VALUE| number|  |
| STENCIL_FUNC| number|  |
| STENCIL_FAIL| number|  |
| STENCIL_PASS_DEPTH_FAIL| number|  |
| STENCIL_PASS_DEPTH_PASS| number|  |
| STENCIL_REF| number|  |
| STENCIL_VALUE_MASK| number|  |
| STENCIL_WRITEMASK| number|  |
| STENCIL_BACK_FUNC| number|  |
| STENCIL_BACK_FAIL| number|  |
| STENCIL_BACK_PASS_DEPTH_FAIL| number|  |
| STENCIL_BACK_PASS_DEPTH_PASS| number|  |
| STENCIL_BACK_REF| number|  |
| STENCIL_BACK_VALUE_MASK| number|  |
| STENCIL_BACK_WRITEMASK| number|  |
| VIEWPORT| number|  |
| SCISSOR_BOX| number|  |
| COLOR_CLEAR_VALUE| number|  |
| COLOR_WRITEMASK| number|  |
| UNPACK_ALIGNMENT| number|  |
| PACK_ALIGNMENT| number|  |
| MAX_TEXTURE_SIZE| number|  |
| MAX_VIEWPORT_DIMS| number|  |
| SUBPIXEL_BITS| number|  |
| RED_BITS| number|  |
| GREEN_BITS| number|  |
| BLUE_BITS| number|  |
| ALPHA_BITS| number|  |
| DEPTH_BITS| number|  |
| STENCIL_BITS| number|  |
| POLYGON_OFFSET_UNITS| number|  |
| POLYGON_OFFSET_FACTOR| number|  |
| TEXTURE_BINDING_2D| number|  |
| SAMPLE_BUFFERS| number|  |
| SAMPLES| number|  |
| SAMPLE_COVERAGE_VALUE| number|  |
| SAMPLE_COVERAGE_INVERT| number|  |
| COMPRESSED_TEXTURE_FORMATS| number|  |
| DONT_CARE| number|  |
| FASTEST| number|  |
| NICEST| number|  |
| GENERATE_MIPMAP_HINT| number|  |
| BYTE| number|  |
| UNSIGNED_BYTE| number|  |
| SHORT| number|  |
| UNSIGNED_SHORT| number|  |
| INT| number|  |
| UNSIGNED_INT| number|  |
| FLOAT| number|  |
| DEPTH_COMPONENT| number|  |
| ALPHA| number|  |
| RGB| number|  |
| RGBA| number|  |
| LUMINANCE| number|  |
| LUMINANCE_ALPHA| number|  |
| UNSIGNED_SHORT_4_4_4_4| number|  |
| UNSIGNED_SHORT_5_5_5_1| number|  |
| UNSIGNED_SHORT_5_6_5| number|  |
| FRAGMENT_SHADER| number|  |
| VERTEX_SHADER| number|  |
| MAX_VERTEX_ATTRIBS| number|  |
| MAX_VERTEX_UNIFORM_VECTORS| number|  |
| MAX_VARYING_VECTORS| number|  |
| MAX_COMBINED_TEXTURE_IMAGE_UNITS| number|  |
| MAX_VERTEX_TEXTURE_IMAGE_UNITS| number|  |
| MAX_TEXTURE_IMAGE_UNITS| number|  |
| MAX_FRAGMENT_UNIFORM_VECTORS| number|  |
| SHADER_TYPE| number|  |
| DELETE_STATUS| number|  |
| LINK_STATUS| number|  |
| VALIDATE_STATUS| number|  |
| ATTACHED_SHADERS| number|  |
| ACTIVE_UNIFORMS| number|  |
| ACTIVE_ATTRIBUTES| number|  |
| SHADING_LANGUAGE_VERSION| number|  |
| CURRENT_PROGRAM| number|  |
| NEVER| number|  |
| LESS| number|  |
| EQUAL| number|  |
| LEQUAL| number|  |
| GREATER| number|  |
| NOTEQUAL| number|  |
| GEQUAL| number|  |
| ALWAYS| number|  |
| KEEP| number|  |
| REPLACE| number|  |
| INCR| number|  |
| DECR| number|  |
| INVERT| number|  |
| INCR_WRAP| number|  |
| DECR_WRAP| number|  |
| VENDOR| number|  |
| RENDERER| number|  |
| VERSION| number|  |
| NEAREST| number|  |
| LINEAR| number|  |
| NEAREST_MIPMAP_NEAREST| number|  |
| LINEAR_MIPMAP_NEAREST| number|  |
| NEAREST_MIPMAP_LINEAR| number|  |
| LINEAR_MIPMAP_LINEAR| number|  |
| TEXTURE_MAG_FILTER| number|  |
| TEXTURE_MIN_FILTER| number|  |
| TEXTURE_WRAP_S| number|  |
| TEXTURE_WRAP_T| number|  |
| TEXTURE_2D| number|  |
| TEXTURE| number|  |
| TEXTURE_CUBE_MAP| number|  |
| TEXTURE_BINDING_CUBE_MAP| number|  |
| TEXTURE_CUBE_MAP_POSITIVE_X| number|  |
| TEXTURE_CUBE_MAP_NEGATIVE_X| number|  |
| TEXTURE_CUBE_MAP_POSITIVE_Y| number|  |
| TEXTURE_CUBE_MAP_NEGATIVE_Y| number|  |
| TEXTURE_CUBE_MAP_POSITIVE_Z| number|  |
| TEXTURE_CUBE_MAP_NEGATIVE_Z| number|  |
| MAX_CUBE_MAP_TEXTURE_SIZE| number|  |
| TEXTURE0| number|  |
| TEXTURE1| number|  |
| TEXTURE2| number|  |
| TEXTURE3| number|  |
| TEXTURE4| number|  |
| TEXTURE5| number|  |
| TEXTURE6| number|  |
| TEXTURE7| number|  |
| TEXTURE8| number|  |
| TEXTURE9| number|  |
| TEXTURE10| number|  |
| TEXTURE11| number|  |
| TEXTURE12| number|  |
| TEXTURE13| number|  |
| TEXTURE14| number|  |
| TEXTURE15| number|  |
| TEXTURE16| number|  |
| TEXTURE17| number|  |
| TEXTURE18| number|  |
| TEXTURE19| number|  |
| TEXTURE20| number|  |
| TEXTURE21| number|  |
| TEXTURE22| number|  |
| TEXTURE23| number|  |
| TEXTURE24| number|  |
| TEXTURE25| number|  |
| TEXTURE26| number|  |
| TEXTURE27| number|  |
| TEXTURE28| number|  |
| TEXTURE29| number|  |
| TEXTURE30| number|  |
| TEXTURE31| number|  |
| ACTIVE_TEXTURE| number|  |
| REPEAT| number|  |
| CLAMP_TO_EDGE| number|  |
| MIRRORED_REPEAT| number|  |
| FLOAT_VEC2| number|  |
| FLOAT_VEC3| number|  |
| FLOAT_VEC4| number|  |
| INT_VEC2| number|  |
| INT_VEC3| number|  |
| INT_VEC4| number|  |
| BOOL| number|  |
| BOOL_VEC2| number|  |
| BOOL_VEC3| number|  |
| BOOL_VEC4| number|  |
| FLOAT_MAT2| number|  |
| FLOAT_MAT3| number|  |
| FLOAT_MAT4| number|  |
| SAMPLER_2D| number|  |
| SAMPLER_CUBE| number|  |
| VERTEX_ATTRIB_ARRAY_ENABLED| number|  |
| VERTEX_ATTRIB_ARRAY_SIZE| number|  |
| VERTEX_ATTRIB_ARRAY_STRIDE| number|  |
| VERTEX_ATTRIB_ARRAY_TYPE| number|  |
| VERTEX_ATTRIB_ARRAY_NORMALIZED| number|  |
| VERTEX_ATTRIB_ARRAY_POINTER| number|  |
| VERTEX_ATTRIB_ARRAY_BUFFER_BINDING| number|  |
| IMPLEMENTATION_COLOR_READ_TYPE| number|  |
| IMPLEMENTATION_COLOR_READ_FORMAT| number|  |
| COMPILE_STATUS| number|  |
| LOW_FLOAT| number|  |
| MEDIUM_FLOAT| number|  |
| HIGH_FLOAT| number|  |
| LOW_INT| number|  |
| MEDIUM_INT| number|  |
| HIGH_INT| number|  |
| FRAMEBUFFER| number|  |
| RENDERBUFFER| number|  |
| RGBA4| number|  |
| RGB5_A1| number|  |
| RGB565| number|  |
| DEPTH_COMPONENT16| number|  |
| STENCIL_INDEX| number|  |
| STENCIL_INDEX8| number|  |
| DEPTH_STENCIL| number|  |
| RENDERBUFFER_WIDTH| number|  |
| RENDERBUFFER_HEIGHT| number|  |
| RENDERBUFFER_INTERNAL_FORMAT| number|  |
| RENDERBUFFER_RED_SIZE| number|  |
| RENDERBUFFER_GREEN_SIZE| number|  |
| RENDERBUFFER_BLUE_SIZE| number|  |
| RENDERBUFFER_ALPHA_SIZE| number|  |
| RENDERBUFFER_DEPTH_SIZE| number|  |
| RENDERBUFFER_STENCIL_SIZE| number|  |
| FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE| number|  |
| FRAMEBUFFER_ATTACHMENT_OBJECT_NAME| number|  |
| FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL| number|  |
| FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE| number|  |
| COLOR_ATTACHMENT0| number|  |
| DEPTH_ATTACHMENT| number|  |
| STENCIL_ATTACHMENT| number|  |
| DEPTH_STENCIL_ATTACHMENT| number|  |
| NONE| number|  |
| FRAMEBUFFER_COMPLETE| number|  |
| FRAMEBUFFER_INCOMPLETE_ATTACHMENT| number|  |
| FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT| number|  |
| FRAMEBUFFER_INCOMPLETE_DIMENSIONS| number|  |
| FRAMEBUFFER_UNSUPPORTED| number|  |
| FRAMEBUFFER_BINDING| number|  |
| RENDERBUFFER_BINDING| number|  |
| MAX_RENDERBUFFER_SIZE| number|  |
| INVALID_FRAMEBUFFER_OPERATION| number|  |
| UNPACK_FLIP_Y_WEBGL| number|  |
| UNPACK_PREMULTIPLY_ALPHA_WEBGL| number|  |
| CONTEXT_LOST_WEBGL| number|  |
| UNPACK_COLORSPACE_CONVERSION_WEBGL| number|  |
| BROWSER_DEFAULT_WEBGL| number|  |
| COMPRESSED_RGB_S3TC_DXT1_EXT| number|  |
| COMPRESSED_RGBA_S3TC_DXT1_EXT| number|  |
| COMPRESSED_RGBA_S3TC_DXT3_EXT| number|  |
| COMPRESSED_RGBA_S3TC_DXT5_EXT| number|  |
| COMPRESSED_RGB_PVRTC_4BPPV1_IMG| number|  |
| COMPRESSED_RGB_PVRTC_2BPPV1_IMG| number|  |
| COMPRESSED_RGBA_PVRTC_4BPPV1_IMG| number|  |
| COMPRESSED_RGBA_PVRTC_2BPPV1_IMG| number|  |
| COMPRESSED_RGBA_ASTC_4x4_WEBGL| number|  |
| COMPRESSED_RGB_ETC1_WEBGL| number|  |
| COMPRESSED_RGBA_BPTC_UNORM| number|  |
| HALF_FLOAT_OES| number|  |
| DOUBLE| number|  |
| READ_BUFFER| number|  |
| UNPACK_ROW_LENGTH| number|  |
| UNPACK_SKIP_ROWS| number|  |
| UNPACK_SKIP_PIXELS| number|  |
| PACK_ROW_LENGTH| number|  |
| PACK_SKIP_ROWS| number|  |
| PACK_SKIP_PIXELS| number|  |
| COLOR| number|  |
| DEPTH| number|  |
| STENCIL| number|  |
| RED| number|  |
| RGB8| number|  |
| RGBA8| number|  |
| RGB10_A2| number|  |
| TEXTURE_BINDING_3D| number|  |
| UNPACK_SKIP_IMAGES| number|  |
| UNPACK_IMAGE_HEIGHT| number|  |
| TEXTURE_3D| number|  |
| TEXTURE_WRAP_R| number|  |
| MAX_3D_TEXTURE_SIZE| number|  |
| UNSIGNED_INT_2_10_10_10_REV| number|  |
| MAX_ELEMENTS_VERTICES| number|  |
| MAX_ELEMENTS_INDICES| number|  |
| TEXTURE_MIN_LOD| number|  |
| TEXTURE_MAX_LOD| number|  |
| TEXTURE_BASE_LEVEL| number|  |
| TEXTURE_MAX_LEVEL| number|  |
| MIN| number|  |
| MAX| number|  |
| DEPTH_COMPONENT24| number|  |
| MAX_TEXTURE_LOD_BIAS| number|  |
| TEXTURE_COMPARE_MODE| number|  |
| TEXTURE_COMPARE_FUNC| number|  |
| CURRENT_QUERY| number|  |
| QUERY_RESULT| number|  |
| QUERY_RESULT_AVAILABLE| number|  |
| STREAM_READ| number|  |
| STREAM_COPY| number|  |
| STATIC_READ| number|  |
| STATIC_COPY| number|  |
| DYNAMIC_READ| number|  |
| DYNAMIC_COPY| number|  |
| MAX_DRAW_BUFFERS| number|  |
| DRAW_BUFFER0| number|  |
| DRAW_BUFFER1| number|  |
| DRAW_BUFFER2| number|  |
| DRAW_BUFFER3| number|  |
| DRAW_BUFFER4| number|  |
| DRAW_BUFFER5| number|  |
| DRAW_BUFFER6| number|  |
| DRAW_BUFFER7| number|  |
| DRAW_BUFFER8| number|  |
| DRAW_BUFFER9| number|  |
| DRAW_BUFFER10| number|  |
| DRAW_BUFFER11| number|  |
| DRAW_BUFFER12| number|  |
| DRAW_BUFFER13| number|  |
| DRAW_BUFFER14| number|  |
| DRAW_BUFFER15| number|  |
| MAX_FRAGMENT_UNIFORM_COMPONENTS| number|  |
| MAX_VERTEX_UNIFORM_COMPONENTS| number|  |
| SAMPLER_3D| number|  |
| SAMPLER_2D_SHADOW| number|  |
| FRAGMENT_SHADER_DERIVATIVE_HINT| number|  |
| PIXEL_PACK_BUFFER| number|  |
| PIXEL_UNPACK_BUFFER| number|  |
| PIXEL_PACK_BUFFER_BINDING| number|  |
| PIXEL_UNPACK_BUFFER_BINDING| number|  |
| FLOAT_MAT2x3| number|  |
| FLOAT_MAT2x4| number|  |
| FLOAT_MAT3x2| number|  |
| FLOAT_MAT3x4| number|  |
| FLOAT_MAT4x2| number|  |
| FLOAT_MAT4x3| number|  |
| SRGB| number|  |
| SRGB8| number|  |
| SRGB8_ALPHA8| number|  |
| COMPARE_REF_TO_TEXTURE| number|  |
| RGBA32F| number|  |
| RGB32F| number|  |
| RGBA16F| number|  |
| RGB16F| number|  |
| VERTEX_ATTRIB_ARRAY_INTEGER| number|  |
| MAX_ARRAY_TEXTURE_LAYERS| number|  |
| MIN_PROGRAM_TEXEL_OFFSET| number|  |
| MAX_PROGRAM_TEXEL_OFFSET| number|  |
| MAX_VARYING_COMPONENTS| number|  |
| TEXTURE_2D_ARRAY| number|  |
| TEXTURE_BINDING_2D_ARRAY| number|  |
| R11F_G11F_B10F| number|  |
| UNSIGNED_INT_10F_11F_11F_REV| number|  |
| RGB9_E5| number|  |
| UNSIGNED_INT_5_9_9_9_REV| number|  |
| TRANSFORM_FEEDBACK_BUFFER_MODE| number|  |
| MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS| number|  |
| TRANSFORM_FEEDBACK_VARYINGS| number|  |
| TRANSFORM_FEEDBACK_BUFFER_START| number|  |
| TRANSFORM_FEEDBACK_BUFFER_SIZE| number|  |
| TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN| number|  |
| RASTERIZER_DISCARD| number|  |
| MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS| number|  |
| MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS| number|  |
| INTERLEAVED_ATTRIBS| number|  |
| SEPARATE_ATTRIBS| number|  |
| TRANSFORM_FEEDBACK_BUFFER| number|  |
| TRANSFORM_FEEDBACK_BUFFER_BINDING| number|  |
| RGBA32UI| number|  |
| RGB32UI| number|  |
| RGBA16UI| number|  |
| RGB16UI| number|  |
| RGBA8UI| number|  |
| RGB8UI| number|  |
| RGBA32I| number|  |
| RGB32I| number|  |
| RGBA16I| number|  |
| RGB16I| number|  |
| RGBA8I| number|  |
| RGB8I| number|  |
| RED_INTEGER| number|  |
| RGB_INTEGER| number|  |
| RGBA_INTEGER| number|  |
| SAMPLER_2D_ARRAY| number|  |
| SAMPLER_2D_ARRAY_SHADOW| number|  |
| SAMPLER_CUBE_SHADOW| number|  |
| UNSIGNED_INT_VEC2| number|  |
| UNSIGNED_INT_VEC3| number|  |
| UNSIGNED_INT_VEC4| number|  |
| INT_SAMPLER_2D| number|  |
| INT_SAMPLER_3D| number|  |
| INT_SAMPLER_CUBE| number|  |
| INT_SAMPLER_2D_ARRAY| number|  |
| UNSIGNED_INT_SAMPLER_2D| number|  |
| UNSIGNED_INT_SAMPLER_3D| number|  |
| UNSIGNED_INT_SAMPLER_CUBE| number|  |
| UNSIGNED_INT_SAMPLER_2D_ARRAY| number|  |
| DEPTH_COMPONENT32F| number|  |
| DEPTH32F_STENCIL8| number|  |
| FLOAT_32_UNSIGNED_INT_24_8_REV| number|  |
| FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING| number|  |
| FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE| number|  |
| FRAMEBUFFER_ATTACHMENT_RED_SIZE| number|  |
| FRAMEBUFFER_ATTACHMENT_GREEN_SIZE| number|  |
| FRAMEBUFFER_ATTACHMENT_BLUE_SIZE| number|  |
| FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE| number|  |
| FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE| number|  |
| FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE| number|  |
| FRAMEBUFFER_DEFAULT| number|  |
| UNSIGNED_INT_24_8| number|  |
| DEPTH24_STENCIL8| number|  |
| UNSIGNED_NORMALIZED| number|  |
| DRAW_FRAMEBUFFER_BINDING| number|  |
| READ_FRAMEBUFFER| number|  |
| DRAW_FRAMEBUFFER| number|  |
| READ_FRAMEBUFFER_BINDING| number|  |
| RENDERBUFFER_SAMPLES| number|  |
| FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER| number|  |
| MAX_COLOR_ATTACHMENTS| number|  |
| COLOR_ATTACHMENT1| number|  |
| COLOR_ATTACHMENT2| number|  |
| COLOR_ATTACHMENT3| number|  |
| COLOR_ATTACHMENT4| number|  |
| COLOR_ATTACHMENT5| number|  |
| COLOR_ATTACHMENT6| number|  |
| COLOR_ATTACHMENT7| number|  |
| COLOR_ATTACHMENT8| number|  |
| COLOR_ATTACHMENT9| number|  |
| COLOR_ATTACHMENT10| number|  |
| COLOR_ATTACHMENT11| number|  |
| COLOR_ATTACHMENT12| number|  |
| COLOR_ATTACHMENT13| number|  |
| COLOR_ATTACHMENT14| number|  |
| COLOR_ATTACHMENT15| number|  |
| FRAMEBUFFER_INCOMPLETE_MULTISAMPLE| number|  |
| MAX_SAMPLES| number|  |
| HALF_FLOAT| number|  |
| RG| number|  |
| RG_INTEGER| number|  |
| R8| number|  |
| RG8| number|  |
| R16F| number|  |
| R32F| number|  |
| RG16F| number|  |
| RG32F| number|  |
| R8I| number|  |
| R8UI| number|  |
| R16I| number|  |
| R16UI| number|  |
| R32I| number|  |
| R32UI| number|  |
| RG8I| number|  |
| RG8UI| number|  |
| RG16I| number|  |
| RG16UI| number|  |
| RG32I| number|  |
| RG32UI| number|  |
| VERTEX_ARRAY_BINDING| number|  |
| R8_SNORM| number|  |
| RG8_SNORM| number|  |
| RGB8_SNORM| number|  |
| RGBA8_SNORM| number|  |
| SIGNED_NORMALIZED| number|  |
| COPY_READ_BUFFER| number|  |
| COPY_WRITE_BUFFER| number|  |
| COPY_READ_BUFFER_BINDING| number|  |
| COPY_WRITE_BUFFER_BINDING| number|  |
| UNIFORM_BUFFER| number|  |
| UNIFORM_BUFFER_BINDING| number|  |
| UNIFORM_BUFFER_START| number|  |
| UNIFORM_BUFFER_SIZE| number|  |
| MAX_VERTEX_UNIFORM_BLOCKS| number|  |
| MAX_FRAGMENT_UNIFORM_BLOCKS| number|  |
| MAX_COMBINED_UNIFORM_BLOCKS| number|  |
| MAX_UNIFORM_BUFFER_BINDINGS| number|  |
| MAX_UNIFORM_BLOCK_SIZE| number|  |
| MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS| number|  |
| MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS| number|  |
| UNIFORM_BUFFER_OFFSET_ALIGNMENT| number|  |
| ACTIVE_UNIFORM_BLOCKS| number|  |
| UNIFORM_TYPE| number|  |
| UNIFORM_SIZE| number|  |
| UNIFORM_BLOCK_INDEX| number|  |
| UNIFORM_OFFSET| number|  |
| UNIFORM_ARRAY_STRIDE| number|  |
| UNIFORM_MATRIX_STRIDE| number|  |
| UNIFORM_IS_ROW_MAJOR| number|  |
| UNIFORM_BLOCK_BINDING| number|  |
| UNIFORM_BLOCK_DATA_SIZE| number|  |
| UNIFORM_BLOCK_ACTIVE_UNIFORMS| number|  |
| UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES| number|  |
| UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER| number|  |
| UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER| number|  |
| INVALID_INDEX| number|  |
| MAX_VERTEX_OUTPUT_COMPONENTS| number|  |
| MAX_FRAGMENT_INPUT_COMPONENTS| number|  |
| MAX_SERVER_WAIT_TIMEOUT| number|  |
| OBJECT_TYPE| number|  |
| SYNC_CONDITION| number|  |
| SYNC_STATUS| number|  |
| SYNC_FLAGS| number|  |
| SYNC_FENCE| number|  |
| SYNC_GPU_COMMANDS_COMPLETE| number|  |
| UNSIGNALED| number|  |
| SIGNALED| number|  |
| ALREADY_SIGNALED| number|  |
| TIMEOUT_EXPIRED| number|  |
| CONDITION_SATISFIED| number|  |
| WAIT_FAILED| number|  |
| SYNC_FLUSH_COMMANDS_BIT| number|  |
| VERTEX_ATTRIB_ARRAY_DIVISOR| number|  |
| ANY_SAMPLES_PASSED| number|  |
| ANY_SAMPLES_PASSED_CONSERVATIVE| number|  |
| SAMPLER_BINDING| number|  |
| RGB10_A2UI| number|  |
| INT_2_10_10_10_REV| number|  |
| TRANSFORM_FEEDBACK| number|  |
| TRANSFORM_FEEDBACK_PAUSED| number|  |
| TRANSFORM_FEEDBACK_ACTIVE| number|  |
| TRANSFORM_FEEDBACK_BINDING| number|  |
| COMPRESSED_R11_EAC| number|  |
| COMPRESSED_SIGNED_R11_EAC| number|  |
| COMPRESSED_RG11_EAC| number|  |
| COMPRESSED_SIGNED_RG11_EAC| number|  |
| COMPRESSED_RGB8_ETC2| number|  |
| COMPRESSED_SRGB8_ETC2| number|  |
| COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2| number|  |
| COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2| number|  |
| COMPRESSED_RGBA8_ETC2_EAC| number|  |
| COMPRESSED_SRGB8_ALPHA8_ETC2_EAC| number|  |
| TEXTURE_IMMUTABLE_FORMAT| number|  |
| MAX_ELEMENT_INDEX| number|  |
| TEXTURE_IMMUTABLE_LEVELS| number|  |
| MAX_TEXTURE_MAX_ANISOTROPY_EXT| number|  |

### constantWindingOrder: number
> Winding order defines the order of vertices for a triangle to be considered front-facing. 

| Name | Type | Description |
| --- | --- | --- |
 |
| CLOCKWISE| number| Vertices are in clockwise order. |
| COUNTER_CLOCKWISE| number| Vertices are in counter-clockwise order. |

## Methods
### addAttribute()
### addDrillPickedResults(pickedResults, limit, results, pickedPrimitives, pickedAttributes, pickedFeatures)→boolean
| Name | Type | Description |
| --- | --- | --- |
 |
| pickedResults| Array.<object>| the results from the pickCallback |
| limit| number| If supplied, stop drilling after collecting this many picks. |
| results| Array.<object>|  |
| pickedPrimitives| Array.<object>|  |
| pickedAttributes| Array.<object>|  |
| pickedFeatures| Array.<object>|  |

### barycentricCoordinates(point, p0, p1, p2,result)→Cartesian3|undefined
> Computes the barycentric coordinates for a point with respect to a triangle. 

| Name | Type | Description |
| --- | --- | --- |
 |
| point| Cartesian2\|Cartesian3| The point to test. |
| p0| Cartesian2\|Cartesian3| The first point of the triangle, corresponding to the barycentric x-axis. |
| p1| Cartesian2\|Cartesian3| The second point of the triangle, corresponding to the barycentric y-axis. |
| p2| Cartesian2\|Cartesian3| The third point of the triangle, corresponding to the barycentric z-axis. |
| result| Cartesian3| optionalThe object onto which to store the result. |

### binarySearch(array, itemToFind, comparator)→number
> Finds an item in a sorted array. 

| Name | Type | Description |
| --- | --- | --- |
 |
| array| Array\|Int8Array\|Uint8Array\|Int16Array\|Uint16Array\|Int32Array\|Uint32Array\|Float32Array\|Float64Array| The sorted array to search. |
| itemToFind| *| The item to find in the array. |
| comparator| binarySearchComparator| The function to use to compare the item to        elements in the array. |

### buildModuleUrl(relativeUrl)→string
> Given a relative URL under the Cesium base URL, returns an absolute URL. 

| Name | Type | Description |
| --- | --- | --- |
 |
| relativeUrl| string| The relative path. |

### clone(object,deep)→object
> Clones an object, returning a new object containing the same properties. 

| Name | Type | Description |
| --- | --- | --- |
 |
| object| object| | The object to clone. |
| deep| boolean| false| optionalIf true, all properties will be deep cloned recursively. |

### combine(object1,object2,deep)→object
> Merges two objects, copying their properties onto a new combined object. When two objects have the same
property, the value of the property on the first object is used.  If either object is undefined,
it will be treated as an empty object. 

| Name | Type | Description |
| --- | --- | --- |
 |
| object1| object| | optionalThe first object to merge. |
| object2| object| | optionalThe second object to merge. |
| deep| boolean| false| optionalPerform a recursive merge. |

### computePickingDrawingBufferRectangle(drawingBufferHeight, position, width, height, result)→BoundingRectangle
> Compute the rectangle that describes the part of the drawing buffer
that is relevant for picking. 

| Name | Type | Description |
| --- | --- | --- |
 |
| drawingBufferHeight| number| The height of the drawing buffer |
| position| Cartesian2| The position inside the drawing buffer |
| width| number\|undefined| The width of the rectangle, assumed to be an odd integer number, default : 3.0 |
| height| number\|undefined| The height of the rectangle. If unspecified, height will default to the value ofwidth |
| result| BoundingRectangle| The result rectangle |

### computeVvlhTransform(time, positionProperty, result)→Matrix4
> Compute the vehicle velocity, local horizontal (VVLH) transform for a position property at a given time.
The VVLH axes is defined based on the motion of the provided position point as follows:
- The X axis is directed toward the point's velocity vector, in the direction of motion.
- The Y axis is along the angular momentum vector.
- The Z axis is along the position vector. 

| Name | Type | Description |
| --- | --- | --- |
 |
| time| JulianDate| The time at which to compute the VVLH transform. |
| positionProperty| PositionProperty| The position to compute the VVLH frame for. |
| result| Matrix4| The object onto which to store the result. |

### copyArrayCartesian3(input)→Array.<Cartesian3>|undefined
> Returns a deep copy of the given array.

If the input is undefined, then undefined is returned.

Otherwise, the result will be a copy of the given array, where
each element is copied with Cartesian3.clone . 

| Name | Type | Description |
| --- | --- | --- |
 |
| input| Array.<Cartesian3>\|undefined| The input array |

### createAABBForNode(x, y, level)→AxisAlignedBoundingBox
> Creates an axis-aligned bounding box for a quadtree node at the given tree-space coordinates and level.
This AABB is in the tree's local space (where the root node of the tree is a unit cube in its own local space). 

| Name | Type | Description |
| --- | --- | --- |
 |
| x| number| The x coordinate of the node. |
| y| number| The y coordinate of the node. |
| level| number| The level of the node. |

### createAnchorPointDirect(anchorPointDirectJson)→AnchorPointDirect
> Creates an `AnchorPointDirect` from the given JSON representation 

| Name | Type | Description |
| --- | --- | --- |
 |
| anchorPointDirectJson| object| The input JSON |

### createAnchorPointIndirect(anchorPointIndirectJson)→AnchorPointIndirect
> Creates an `AnchorPointIndirect` from the given JSON representation 

| Name | Type | Description |
| --- | --- | --- |
 |
| anchorPointIndirectJson| object| The input JSON |

### createCommand(func,canExecute)
> Create a Command from a given function, for use with ViewModels.

A Command is a function with an extra canExecute observable property to determine
whether the command can be executed.  When executed, a Command function will check the
value of canExecute and throw if false.  It also provides events for when
a command has been or is about to be executed. 

| Name | Type | Description |
| --- | --- | --- |
 |
| func| function| | The function to execute. |
| canExecute| boolean| true| optionalA boolean indicating whether the function can currently be executed. |

### createCorrelationGroup(correlationGroupJson)→CorrelationGroup
> Creates a `CorrelationGroup` from the given JSON representation 

| Name | Type | Description |
| --- | --- | --- |
 |
| correlationGroupJson| object| The input JSON |

### createCovarianceMatrixFromUpperTriangle(array)→Matrix3
> Creates a Matrix3 that describes a covariance matrix (which is
symmetric) from the array containing the upper triangle, in
column-major order. 

| Name | Type | Description |
| --- | --- | --- |
 |
| array| Array.<number>| The input array |

### createElevationBandMaterial(options)→Material
> Creates a Material that combines multiple layers of color/gradient bands and maps them to terrain heights.

The shader does a binary search over all the heights to find out which colors are above and below a given height, and
interpolates between them for the final color. This material supports hundreds of entries relatively cheaply. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| Object with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDescription |
| scene| Scene| The scene where the visualization is taking place. |
| layers| Array.<createElevationBandMaterialBand>| A list of bands ordered from lowest to highest precedence. |

### asynccreateGooglePhotorealistic3DTileset(apiOptions,tilesetOptions)→Promise.<Cesium3DTileset>
> Creates a Cesium3DTileset instance for the Google Photorealistic 3D
Tiles tileset.

Google Photorealistic 3D Tiles can only be used with the Google geocoder.  To
confirm that you are aware of this restriction pass
`usingOnlyWithGoogleGeocoder: true` to the apiOptions.  Otherwise a one time
warning will be displayed when this function is called. 

| Name | Type | Description |
| --- | --- | --- |
 |
| apiOptions| object| optional
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| key| string| GoogleMaps.defaultApiKey| optionalYour API key to access Google Photorealistic 3D Tiles. Seehttps://developers.google.com/maps/documentation/javascript/get-api-keyfor instructions on how to create your own key. |
| onlyUsingWithGoogleGeocoder| true| | optionalConfirmation that this tileset will only be used with the Google geocoder. |

### createGuid()→string
> Creates a Globally unique identifier (GUID) string.  A GUID is 128 bits long, and can guarantee uniqueness across space and time. 

### asynccreateOsmBuildingsAsync(options)→Promise.<Cesium3DTileset>
> Creates a Cesium3DTileset instance for the Cesium OSM Buildings tileset. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalConstruction options. Any options allowed by theCesium3DTilesetconstructor        may be specified here. In addition to those, the following properties are supported:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| defaultColor| Color| Color.WHITE| optionalThe default color to use for buildings        that do not have a color. This parameter is ignored ifoptions.styleis specified. |
| style| Cesium3DTileStyle| | optionalThe style to use with the tileset. If not        specified, a default style is used which gives each building or building part a        color inferred from its OpenStreetMaptags. If no color can be inferred,options.defaultColoris used. |
| enableShowOutline| boolean| true| optionalIf true, enable rendering outlines. This can be set to false to avoid the additional processing of geometry at load time. |
| showOutline| boolean| true| optionalWhether to show outlines around buildings. When true,        outlines are displayed. When false, outlines are not displayed. |

### createTangentSpaceDebugPrimitive(options)→Primitive
> Creates a Primitive to visualize well-known vector vertex attributes: normal , tangent , and bitangent .  Normal
is red; tangent is green; and bitangent is blue.  If an attribute is not
present, it is not drawn. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| Object with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| geometry| Geometry| | TheGeometryinstance with the attribute. |
| length| number| 10000.0| optionalThe length of each line segment in meters.  This can be negative to point the vector in the opposite direction. |
| modelMatrix| Matrix4| Matrix4.IDENTITY| optionalThe model matrix that transforms to transform the geometry from model to world coordinates. |

### createWorldBathymetryAsync(options)→Promise.<CesiumTerrainProvider>
> Creates a CesiumTerrainProvider instance for the Cesium World Bathymetry . 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| requestVertexNormals| boolean| false| optionalFlag that indicates if the client should request additional lighting information from the server if available. |

### createWorldImageryAsync(options)→Promise.<IonImageryProvider>
> Creates an IonImageryProvider instance for ion's default global base imagery layer, currently Bing Maps. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| style| IonWorldImageryStyle| IonWorldImageryStyle| optionalThe style of base imagery, only AERIAL, AERIAL_WITH_LABELS, and ROAD are currently supported. |

### createWorldTerrainAsync(options)→Promise.<CesiumTerrainProvider>
> Creates a CesiumTerrainProvider instance for the Cesium World Terrain . 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| requestVertexNormals| boolean| false| optionalFlag that indicates if the client should request additional lighting information from the server if available. |
| requestWaterMask| boolean| false| optionalFlag that indicates if the client should request per tile water masks from the server if available. |

### defined(value)→boolean
| Name | Type | Description |
| --- | --- | --- |
 |
| value| *| The object. |

### destroyObject(object,message)
> Destroys an object.  Each of the object's functions, including functions in its prototype,
is replaced with a function that throws a DeveloperError , except for the object's isDestroyed function, which is set to a function that returns true .
The object's properties are removed with delete . This function is used by objects that hold native resources, e.g., WebGL resources, which
need to be explicitly released.  Client code calls an object's destroy function,
which then releases the native resource and calls destroyObject to put itself
in a destroyed state. 

| Name | Type | Description |
| --- | --- | --- |
 |
| object| object| The object to destroy. |
| message| string| optionalThe message to include in the exception that is thrown if                           a destroyed object's function is called. |

### drillPick(pickCallback,limit)→Array.<object>
> Drill pick by repeatedly calling a given `pickCallback`, each time stripping away the previously picked objects. 

| Name | Type | Description |
| --- | --- | --- |
 |
| pickCallback| function| | Pick callback to execute each iteration |
| limit| number| Number.MAX_VALUE| optionalIf supplied, stop drilling after collecting this many picks |

### equalsArrayCartesian3(a, b)→boolean
> Returns whether the given arrays are component-wise equal.

When both arrays are undefined, then true is returned.
When only one array is defined, or they are both defined but have
different lengths, then false is returned.

Otherwise, returns whether the corresponding elements of the arrays
are equal, as of Cartesian3.equals . 

| Name | Type | Description |
| --- | --- | --- |
 |
| a| Array.<Cartesian3>\|undefined| The first array |
| b| Array.<Cartesian3>\|undefined| The second array |

### exportKml(options)→Promise.<(exportKmlResultKml|exportKmlResultKmz)>
> Exports an EntityCollection as a KML document. Only Point, Billboard, Model, Path, Polygon, Polyline geometries
will be exported. Note that there is not a 1 to 1 mapping of Entity properties to KML Feature properties. For
example, entity properties that are time dynamic but cannot be dynamic in KML are exported with their values at
options.time or the beginning of the EntityCollection's time interval if not specified. For time-dynamic properties
that are supported in KML, we use the samples if it is a SampledProperty otherwise we sample the value using
the options.sampleDuration. Point, Billboard, Model and Path geometries with time-dynamic positions will be exported
as gx:Track Features. Not all Materials are representable in KML, so for more advanced Materials just the primary
color is used. Canvas objects are exported as PNG images. 

| Name | Type | Description |
| --- | --- | --- |
 |
| options| object| An object with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| entities| EntityCollection| | The EntityCollection to export as KML. |
| ellipsoid| Ellipsoid| Ellipsoid.default| optionalThe ellipsoid for the output file. |
| modelCallback| exportKmlModelCallback| | optionalA callback that will be called with aModelGraphicsinstance and should return the URI to use in the KML. Required if a model exists in the entity collection. |
| time| JulianDate| entities.computeAvailability().start| optionalThe time value to use to get properties that are not time varying in KML. |
| defaultAvailability| TimeInterval| entities.computeAvailability()| optionalThe interval that will be sampled if an entity doesn't have an availability. |
| sampleDuration| number| 60| optionalThe number of seconds to sample properties that are varying in KML. |
| kmz| boolean| false| optionalIf true KML and external files will be compressed into a kmz file. |

### formatError(object)→string
> Formats an error object into a String.  If available, uses name, message, and stack
properties, otherwise, falls back on toString(). 

| Name | Type | Description |
| --- | --- | --- |
 |
| object| *| The item to find in the array. |

### getAbsoluteUri(relative,base)→string
> Given a relative Uri and a base Uri, returns the absolute Uri of the relative Uri. 

| Name | Type | Description |
| --- | --- | --- |
 |
| relative| string| The relative Uri. |
| base| string| optionalThe base Uri. |

### getBaseUri(uri,includeQuery)→string
> Given a URI, returns the base path of the URI. 

| Name | Type | Description |
| --- | --- | --- |
 |
| uri| string| | The Uri. |
| includeQuery| boolean| false| optionalWhether or not to include the query string and fragment form the uri |

### getExtensionFromUri(uri)→string
> Given a URI, returns the extension of the URI. 

| Name | Type | Description |
| --- | --- | --- |
 |
| uri| string| The Uri. |

### getFilenameFromUri(uri)→string
> Given a URI, returns the last segment of the URI, removing any path or query information. 

| Name | Type | Description |
| --- | --- | --- |
 |
| uri| string| The Uri. |

### getImagePixels(image, width, height)→ImageData
> Extract a pixel array from a loaded image.  Draws the image
into a canvas so it can read the pixels back. 

| Name | Type | Description |
| --- | --- | --- |
 |
| image| HTMLImageElement\|ImageBitmap| The image to extract pixels from. |
| width| number| The width of the image. If not defined, then image.width is assigned. |
| height| number| The height of the image. If not defined, then image.height is assigned. |

### getSourceValueStringComponent(classProperty, metadataProperty, componentName)→string
> Creates a shader statement that returns the value of the specified
component of the given property, normalized to the range [0, 1]. 

| Name | Type | Description |
| --- | --- | --- |
 |
| classProperty| MetadataClassProperty| The class property |
| metadataProperty| object| The metadata property, either a `PropertyTextureProperty` or a `PropertyAttributeProperty` |
| componentName| string| The name, in ["x", "y", "z", "w"] |

### getSourceValueStringScalar(classProperty, metadataProperty)→string
> Creates a shader statement that returns the value of the specified
property, normalized to the range [0, 1]. 

| Name | Type | Description |
| --- | --- | --- |
 |
| classProperty| MetadataClassProperty| The class property |
| metadataProperty| object| The metadata property, either a `PropertyTextureProperty` or a `PropertyAttributeProperty` |

### getTimestamp()→number
> Gets a timestamp that can be used in measuring the time between events.  Timestamps
are expressed in milliseconds, but it is not specified what the milliseconds are
measured from.  This function uses performance.now() if it is available, or Date.now()
otherwise. 

### hue2rgb()
### isLeapYear(year)→boolean
> Determines if a given date is a leap year. 

| Name | Type | Description |
| --- | --- | --- |
 |
| year| number| The year to be tested. |

### loadCubeMapImagesForUniform(material, uniformId)
> Loads the images for a cubemap uniform, if it has changed since the last time this was called. 

| Name | Type | Description |
| --- | --- | --- |
 |
| material| Material| The material to load the cubemap images for. |
| uniformId| string| The ID of the uniform that corresponds to the cubemap images. |

### asyncloadGltfJson()
> Loads the gltf object 

### measureText()
> Computes dimensions for text, based on current canvas state.

Rounds metrics, excluding width, to whole pixels. This is purely to minimize
rendering differences with migration to in-browser measureText(), and may be
revised in the future. See: github.com/CesiumGS/cesium/pull/13081 

### mergeSort(array, comparator,userDefinedObject)
> A stable merge sort. 

| Name | Type | Description |
| --- | --- | --- |
 |
| array| Array\|Int8Array\|Uint8Array\|Int16Array\|Uint16Array\|Int32Array\|Uint32Array\|Float32Array\|Float64Array| The array to sort. |
| comparator| mergeSortComparator| The function to use to compare elements in the array. |
| userDefinedObject| *| optionalAny item to pass as the third parameter tocomparator. |

### objectToQuery(obj)→string
> Converts an object representing a set of name/value pairs into a query string,
with names and values encoded properly for use in a URL.  Values that are arrays
will produce multiple values with the same name. 

| Name | Type | Description |
| --- | --- | --- |
 |
| obj| object| The object containing data to encode. |

### obtainTranslucentCommandExecutionFunction(scene)→function
> Determine how translucent surfaces will be handled.

When OIT is enabled, then this will delegate to OIT.executeCommands.
Otherwise, it will just be executeTranslucentCommandsBackToFront
for render passes, or executeTranslucentCommandsFrontToBack for
other passes. 

| Name | Type | Description |
| --- | --- | --- |
 |
| scene| Scene| The scene. |

### pickBegin(scene, windowPosition, drawingBufferRectangle,width,height)
> Setup needed before picking. 

| Name | Type | Description |
| --- | --- | --- |
 |
| scene| Scene| |  |
| windowPosition| Cartesian2| | Window coordinates to perform picking on. |
| drawingBufferRectangle| BoundingRectangle| | The output drawing buffer recangle. |
| width| number| 3| optionalWidth of the pick rectangle. |
| height| number| 3| optionalHeight of the pick rectangle. |

### pickEnd(scene)
> Teardown needed after picking. 

| Name | Type | Description |
| --- | --- | --- |
 |
| scene| Scene|  |

### pointInsideTriangle(point, p0, p1, p2)→boolean
> Determines if a point is inside a triangle. 

| Name | Type | Description |
| --- | --- | --- |
 |
| point| Cartesian2\|Cartesian3| The point to test. |
| p0| Cartesian2\|Cartesian3| The first point of the triangle. |
| p1| Cartesian2\|Cartesian3| The second point of the triangle. |
| p2| Cartesian2\|Cartesian3| The third point of the triangle. |

### queryToObject(queryString)→object
> Parses a query string into an object, where the keys and values of the object are the
name/value pairs from the query string, decoded. If a name appears multiple times,
the value in the object will be an array of values. 

| Name | Type | Description |
| --- | --- | --- |
 |
| queryString| string| The query string. |

### removeExtension(gltf, extension)→*
> Removes an extension from gltf.extensions, gltf.extensionsUsed, gltf.extensionsRequired, and any other objects in the glTF if it is present. 

| Name | Type | Description |
| --- | --- | --- |
 |
| gltf| object| A javascript object containing a glTF asset. |
| extension| string| The extension to remove. |

### removeInvalidBinaryBodyReferences(parsedContent)
> Remove all invalid binary body references from the batch table
JSON of the given parsed content.

This is a workaround for gracefully handling the invalid PNTS
files that may have been created by the point cloud tiler.
See https://github.com/CesiumGS/cesium/issues/12872

When the batch table JSON is undefined, nothing will be done.
When the batch table binary is defined, nothing will be done
(assuming that any binary body references are valid - this is
not checked here).

Otherwise, this will remove all binary body references from the
batch table JSON that are not resolved from draco via the
`parsedContent.draco.batchTableProperties`.

If any (invalid) binary body reference is found (and removed),
a one-time warning will be printed. 

| Name | Type | Description |
| --- | --- | --- |
 |
| parsedContent| object| The parsed content |

### sampleTerrain(terrainProvider, level, positions,rejectOnTileFail)→Promise.<Array.<Cartographic>>
> Initiates a terrain height query for an array of Cartographic positions by
requesting tiles from a terrain provider, sampling, and interpolating.  The interpolation
matches the triangles used to render the terrain at the specified level.  The query
happens asynchronously, so this function returns a promise that is resolved when
the query completes.  Each point height is modified in place.  If a height can not be
determined because no terrain data is available for the specified level at that location,
or another error occurs, the height is set to undefined.  As is typical of the Cartographic type, the supplied height is a height above the reference ellipsoid
(such as Ellipsoid.WGS84 ) rather than an altitude above mean sea level.  In other
words, it will not necessarily be 0.0 if sampled in the ocean. This function needs the
terrain level of detail as input, if you need to get the altitude of the terrain as precisely
as possible (i.e. with maximum level of detail) use sampleTerrainMostDetailed . 

| Name | Type | Description |
| --- | --- | --- |
 |
| terrainProvider| TerrainProvider| | The terrain provider from which to query heights. |
| level| number| | The terrain level-of-detail from which to query terrain heights. |
| positions| Array.<Cartographic>| | The positions to update with terrain heights. |
| rejectOnTileFail| boolean| false| optionalIf true, for any failed terrain tile requests, the promise will be rejected. If false, returned heights will be undefined. |

### sampleTerrainMostDetailed(terrainProvider, positions,rejectOnTileFail)→Promise.<Array.<Cartographic>>
> Initiates a sampleTerrain() request at the maximum available tile level for a terrain dataset. 

| Name | Type | Description |
| --- | --- | --- |
 |
| terrainProvider| TerrainProvider| | The terrain provider from which to query heights. |
| positions| Array.<Cartographic>| | The positions to update with terrain heights. |
| rejectOnTileFail| boolean| false| optionalIf true, for a failed terrain tile request the promise will be rejected. If false, returned heights will be undefined. |

### srgbToLinear(value)→number
> Converts the value from sRGB color space to linear color space. 

| Name | Type | Description |
| --- | --- | --- |
 |
| value| number| The color value in sRGB color space. |

### Stereographic(position,tangentPlane)
> Represents a point in stereographic coordinates, which can be obtained by projecting a cartesian coordinate from one pole onto a tangent plane at the other pole.
The stereographic projection faithfully represents the relative directions of all great circles passing through its center point.
To faithfully represents angles everywhere, this is a conformal projection, which means points are projected onto an arbrary sphere. 

| Name | Type | Description |
| --- | --- | --- |
 |
| position| Cartesian2| optionalThe steroegraphic coordinates. |
| tangentPlane| EllipseGeometry| optionalThe tangent plane onto which the point was projected. |

### subdivideArray(array, numberOfArrays)
> Subdivides an array into a number of smaller, equal sized arrays. 

| Name | Type | Description |
| --- | --- | --- |
 |
| array| Array| The array to divide. |
| numberOfArrays| number| The number of arrays to divide the provided array into. |

### transformToEntityFrame(time, pathEntityPos, refEntityPos, refEntity, result)→Cartesian3|undefined
> Transforms a path entity's position into the local frame of the reference entity.
If the reference entity has an orientation, uses that orientation to define the local frame.
Otherwise, falls back to a VVLH (Vehicle Velocity Local Horizontal) frame derived from the reference entity's velocity. 

| Name | Type | Description |
| --- | --- | --- |
 |
| time| JulianDate| The time at which to evaluate the orientation or VVLH frame. |
| pathEntityPos| Cartesian3| The position of the path entity in the FIXED reference frame. |
| refEntityPos| Cartesian3| The position of the reference entity in the FIXED reference frame. |
| refEntity| Entity| The reference entity whose frame to transform into. |
| result| Cartesian3| The object onto which to store the result. |

### unapplyValueTransform(input, offset, scale)→string
> Returns a shader statement that applies the inverse of the
value transform to the given value, based on the given offset
and scale. 

| Name | Type | Description |
| --- | --- | --- |
 |
| input| string| The input value |
| offset| string| The offset |
| scale| string| The scale |

### unnormalize(input, componentType)→string
> Returns a shader statement that applies the inverse of the
normalization, based on the given component type 

| Name | Type | Description |
| --- | --- | --- |
 |
| input| string| The input value |
| componentType| string| The component type |

### viewerCesium3DTilesInspectorMixin(viewer)
> A mixin which adds the Cesium3DTilesInspector widget to the Viewer widget.
Rather than being called directly, this function is normally passed as
a parameter to Viewer#extend , as shown in the example below. 

| Name | Type | Description |
| --- | --- | --- |
 |
| viewer| Viewer| The viewer instance. |

### viewerCesiumInspectorMixin(viewer)
> A mixin which adds the CesiumInspector widget to the Viewer widget.
Rather than being called directly, this function is normally passed as
a parameter to Viewer#extend , as shown in the example below. 

| Name | Type | Description |
| --- | --- | --- |
 |
| viewer| Viewer| The viewer instance. |

### viewerDragDropMixin(viewer,options)
> A mixin which adds default drag and drop support for CZML files to the Viewer widget.
Rather than being called directly, this function is normally passed as
a parameter to Viewer#extend , as shown in the example below. 

| Name | Type | Description |
| --- | --- | --- |
 |
| viewer| Viewer| The viewer instance. |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| dropTarget| Element\|string| viewer.container| optionalThe DOM element which will serve as the drop target. |
| clearOnDrop| boolean| true| optionalWhen true, dropping files will clear all existing data sources first, when false, new data sources will be loaded after the existing ones. |
| flyToOnDrop| boolean| true| optionalWhen true, dropping files will fly to the data source once it is loaded. |
| clampToGround| boolean| true| optionalWhen true, datasources are clamped to the ground. |
| proxy| Proxy| | optionalThe proxy to be used for KML network links. |

### viewerPerformanceWatchdogMixin(viewer,options)
> A mixin which adds the PerformanceWatchdog widget to the Viewer widget.
Rather than being called directly, this function is normally passed as
a parameter to Viewer#extend , as shown in the example below. 

| Name | Type | Description |
| --- | --- | --- |
 |
| viewer| Viewer| The viewer instance. |
| options| object| optionalAn object with properties.
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| lowFrameRateMessage| string| 'This application appears to be performing poorly on your system.  Please try using a different web browser or updating your video drivers.'| optionalThe        message to display when a low frame rate is detected.  The message is interpeted as HTML, so make sure        it comes from a trusted source so that your application is not vulnerable to cross-site scripting attacks. |

### viewerVoxelInspectorMixin(viewer)
> A mixin which adds the VoxelInspector widget to the Viewer widget.
Rather than being called directly, this function is normally passed as
a parameter to Viewer#extend , as shown in the example below. 

| Name | Type | Description |
| --- | --- | --- |
 |
| viewer| Viewer| The viewer instance. |

### writeTextToCanvas(text,options)→HTMLCanvasElement|undefined
> Writes the given text into a new canvas.  The canvas will be sized to fit the text.
If text is blank, returns undefined. 

| Name | Type | Description |
| --- | --- | --- |
 |
| text| string| The text to write. |
| options| object| optionalObject with the following properties:
| Name | Type | Description |
| --- | --- | --- |
NameTypeDefaultDescription |
| font| string| '10px sans-serif'| optionalThe CSS font to use. |
| fill| boolean| true| optionalWhether to fill the text. |
| stroke| boolean| false| optionalWhether to stroke the text. |
| fillColor| Color| Color.WHITE| optionalThe fill color. |
| strokeColor| Color| Color.BLACK| optionalThe stroke color. |
| strokeWidth| number| 1| optionalThe stroke width. |
| backgroundColor| Color| Color.TRANSPARENT| optionalThe background color of the canvas. |
| padding| number| 0| optionalThe pixel size of the padding to add around the text. |

## Type Definitions
### binarySearchComparator(a, b)→number
> A function used to compare two items while performing a binary search. 

| Name | Type | Description |
| --- | --- | --- |
 |
| a| *| An item in the array. |
| b| *| The item being searched for. |

### BufferPointMaterialOptions
| Name | Type | Description |
| --- | --- | --- |
 |
| color| Color| <optional>| Color.WHITE| Color of fill. |
| outlineColor| Color| <optional>| Color.WHITE| Color of outline. |
| outlineWidth| number| <optional>| 0.0| Width of outline, 0-255px. |
| size| number| <optional>| 1.0| Size of point, 0-255px. |

### BufferPointOptions
| Name | Type | Description |
| --- | --- | --- |
 |
| options.modelMatrix| Matrix4| <optional>| Matrix4.IDENTITY| Transforms geometry from model to world coordinates. |
| show| boolean| <optional>| true|  |
| material| BufferPointMaterial| <optional>| BufferPointMaterial.DEFAULT_MATERIAL|  |
| position| Cartesian3| <optional>| Cartesian3.ZERO|  |

### BufferPolygonMaterialOptions
| Name | Type | Description |
| --- | --- | --- |
 |
| color| Color| <optional>| Color.WHITE| Color of fill. |
| outlineColor| Color| <optional>| Color.WHITE| Color of outline. |
| outlineWidth| number| <optional>| 0.0| Width of outline, 0-255px. |

### BufferPolygonOptions
| Name | Type | Description |
| --- | --- | --- |
 |
| options.modelMatrix| Matrix4| <optional>| Matrix4.IDENTITY| Transforms geometry from model to world coordinates. |
| show| boolean| <optional>| true|  |
| material| BufferPolygonMaterial| <optional>| BufferPolygonMaterial.DEFAULT_MATERIAL|  |
| positions| TypedArray| <optional>| |  |
| holes| TypedArray| <optional>| |  |
| triangles| TypedArray| <optional>| |  |

### BufferPolylineMaterialOptions
| Name | Type | Description |
| --- | --- | --- |
 |
| color| Color| <optional>| Color.WHITE| Color of fill. |
| outlineColor| Color| <optional>| Color.WHITE| Color of outline. |
| outlineWidth| number| <optional>| 0.0| Width of outline, 0-255px. |
| width| number| <optional>| 1.0| Width of line, 0-255px. |

### BufferPolylineOptions
| Name | Type | Description |
| --- | --- | --- |
 |
| options.modelMatrix| Matrix4| <optional>| Matrix4.IDENTITY| Transforms geometry from model to world coordinates. |
| show| boolean| <optional>| true|  |
| material| BufferPolylineMaterial| <optional>| BufferPolylineMaterial.DEFAULT_MATERIAL|  |
| positions| TypedArray| <optional>| |  |

### BufferPrimitiveMaterialOptions
| Name | Type | Description |
| --- | --- | --- |
 |
| color| Color| <optional>| Color.WHITE| Color of fill. |
| outlineColor| Color| <optional>| Color.WHITE| Color of outline. |
| outlineWidth| number| <optional>| 0.0| Width of outline, 0-255px. |

### BufferPrimitiveOptions
| Name | Type | Description |
| --- | --- | --- |
 |
| show| boolean| <optional>| true|  |
| material| BufferPrimitiveMaterial| <optional>| |  |

### ComponentReaderCallback(dataView, byteOffset)→number|BigInt
> Reads and returns a value with the given type
at the given byte offset from the data view, in little-endian
order 

| Name | Type | Description |
| --- | --- | --- |
 |
| dataView| DataView| Typed data view into a binary buffer |
| byteOffset| number| The offset, in bytes, from the start of the view to read the data from |

### ComponentsReaderCallback(dataView, byteOffset, numberOfComponents, result)
> Reads and returns a value with the given type
at the given byte offset from the data view, in little-endian
order 

| Name | Type | Description |
| --- | --- | --- |
 |
| dataView| DataView| Typed data view into a binary buffer |
| byteOffset| number| The offset, in bytes, from the start of the view to read the data from |
| numberOfComponents| number| The number of components to read |
| result| Array.<number>| The array in which to read the result |

### ContextOptions
> Options to control the setting up of a WebGL Context. allowTextureFilterAnisotropic defaults to true, which enables
anisotropic texture filtering when the WebGL extension is supported.
Setting this to false will improve performance, but hurt visual quality,
especially for horizon views. 

| Name | Type | Description |
| --- | --- | --- |
 |
| requestWebgl1| boolean| <optional>| false| If true and the browser supports it, use a WebGL 1 rendering context |
| allowTextureFilterAnisotropic| boolean| <optional>| true| If true, use anisotropic filtering during texture sampling |
| webgl| WebGLOptions| <optional>| | WebGL options to be passed on to canvas.getContext |
| getWebGLStub| function| <optional>| | A function to create a WebGL stub for testing |

### createElevationBandMaterialBand
| Name | Type | Description |
| --- | --- | --- |
 |
| entries| Array.<createElevationBandMaterialEntry>| | | A list of elevation entries. They will automatically be sorted from lowest to highest. If there is only one entry andextendsDownardsandextendUpwardsare bothfalse, they will both be set totrue. |
| extendDownwards| boolean| <optional>| false| Iftrue, the band's minimum elevation color will extend infinitely downwards. |
| extendUpwards| boolean| <optional>| false| Iftrue, the band's maximum elevation color will extend infinitely upwards. |

### createElevationBandMaterialEntry
| Name | Type | Description |
| --- | --- | --- |
 |
| height| number| The height. |
| color| Color| The color at this height. |

### Destroyable
### DirectionUp
> An orientation given by a pair of unit vectors 

| Name | Type | Description |
| --- | --- | --- |
 |
| direction| Cartesian3| The unit "direction" vector |
| up| Cartesian3| The unit "up" vector |

### exportKmlModelCallback(model, time, externalFiles)→string
> Since KML does not support glTF models, this callback is required to specify what URL to use for the model in the KML document.
It can also be used to add additional files to the externalFiles object, which is the list of files embedded in the exported KMZ,
or otherwise returned with the KML string when exporting. 

| Name | Type | Description |
| --- | --- | --- |
 |
| model| ModelGraphics| The ModelGraphics instance for an Entity. |
| time| JulianDate| The time that any properties should use to get the value. |
| externalFiles| object| An object that maps a filename to a Blob or a Promise that resolves to a Blob. |

### exportKmlResultKml
| Name | Type | Description |
| --- | --- | --- |
 |
| kml| string| The generated KML. |
| externalFiles| Object.<string, Blob>| An object dictionary of external files |

### exportKmlResultKmz
| Name | Type | Description |
| --- | --- | --- |
 |
| kmz| Blob| The generated kmz file. |

### HeadingPitchRollValues
> An orientation given by numeric heading, pitch, and roll 

| Name | Type | Description |
| --- | --- | --- |
 |
| heading| number| <optional>| 0.0| The heading in radians |
| pitch| number| <optional>| -CesiumMath.PI_OVER_TWO| The pitch in radians |
| roll| number| <optional>| 0.0| The roll in radians |

### ImageryTypes
> The format in which ImageryProvider methods return an image may
vary by provider, configuration, or server settings.  Most common are HTMLImageElement , HTMLCanvasElement , or on supported
browsers, ImageBitmap .

See the documentation for each ImageryProvider class for more information about how they return images. 

### mergeSortComparator(a, b,userDefinedObject)→number
> A function used to compare two items while performing a merge sort. 

| Name | Type | Description |
| --- | --- | --- |
 |
| a| *| An item in the array. |
| b| *| An item in the array. |
| userDefinedObject| *| optionalAn object that was passed tomergeSort. |

### MetadataValue
> An instance of a metadata value. This can be one of the following types: number for type SCALAR and numeric component types except for INT64 or UINT64 bigint for type SCALAR and component type INT64 or UINT64 string for type STRING or ENUM boolean for type BOOLEAN Cartesian2 for type VEC2 Cartesian3 for type VEC3 Cartesian4 for type VEC4 Matrix2 for type MAT2 Matrix3 for type MAT3 Matrix4 for type MAT4 Arrays of these types when the metadata value is an array 

### PickedMetadataInfo
> Information about metadata that is supposed to be picked 

| Name | Type | Description |
| --- | --- | --- |
 |
| schemaId| string\|undefined| The optional ID of the metadata schema |
| className| string| The name of the metadata class |
| propertyName| string| The name of the metadata property |
| classProperty| MetadataClassProperty| The metadata class property |

### TypedArray
> Union of all numeric typed array types. 

### TypedArrayConstructor
> Union of all numeric typed array constructor types. 

### UniformSpecifier
> An object describing a uniform, its type, and an initial value 

| Name | Type | Description |
| --- | --- | --- |
 |
| type| UniformType| The Glsl type of the uniform. |
| value| boolean\|number\|Cartesian2\|Cartesian3\|Cartesian4\|Matrix2\|Matrix3\|Matrix4\|TextureUniform| The initial value of the uniform |

### VertexColorInfo
| Name | Type | Description |
| --- | --- | --- |
 |
| colors| Float32Array| The packed per-vertex colors. |
| count| number| The number of vertices. |

### WebGLOptions
> WebGL options to be passed on to HTMLCanvasElement.getContext().
See WebGLContextAttributes but note the modified defaults for 'alpha', 'stencil', and 'powerPreference' alpha defaults to false, which can improve performance
compared to the standard WebGL default of true.  If an application needs
to composite Cesium above other HTML elements using alpha-blending, set alpha to true. 

| Name | Type | Description |
| --- | --- | --- |
 |
| alpha| boolean| <optional>| false|  |
| depth| boolean| <optional>| true|  |
| stencil| boolean| <optional>| false|  |
| antialias| boolean| <optional>| true|  |
| premultipliedAlpha| boolean| <optional>| true|  |
| preserveDrawingBuffer| boolean| <optional>| false|  |
| powerPreference| "default"\|"low-power"\|"high-performance"| <optional>| "high-performance"|  |
| failIfMajorPerformanceCaveat| boolean| <optional>| false|  |


---
