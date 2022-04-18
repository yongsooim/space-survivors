import Box2DFactory from 'box2d-wasm';



/************** box2d test  */

/**
 * importing from 'box2d-wasm' like this requires you to have
 * {
 *   compilerOptions: {
 *     moduleResolution: "node"
 *   }
 * }
 * in your tsconfig.json
 */

/*  Box2DFactory().then((box2D: typeof Box2D & EmscriptenModule) => {
   console.log(box2D);
 });

 const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World } = Box2D;

// in metres per second squared
const gravity = new b2Vec2(0, 10);
const world = new b2World(gravity);

const sideLengthMetres = 1;
const square = new b2PolygonShape();
square.SetAsBox(sideLengthMetres/2, sideLengthMetres/2);

const zero = new b2Vec2(0, 0);

const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);
bd.set_position(zero);

const body = world.CreateBody(bd);
body.CreateFixture(square, 1);
body.SetTransform(zero, 0);
body.SetLinearVelocity(zero);
body.SetAwake(true);
body.SetEnabled(true);




 */











 /*************** worker test */
 
for(var i = 0 ; i < 10 ; i++) {
    console.log('executed in enemy worker')
}

postMessage('enemy worker done')
onmessage = event => { 
    if(event.data){
        try{
            //console.log(JSON.parse(new TextDecoder().decode(event.data)))
        } catch {
            console.log('no json')
        }
    }
};

