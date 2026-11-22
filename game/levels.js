export const levels = [
  {
    name: 'The Velvet Gallery', objective: 'Steal the Star of Vesper, then slip through the east exit.',
    hint: 'Three routes: left past the camera, center through the patrol, or weave behind the plants.',
    spawn: { x: 106, y: 360 }, exit: { x: 1192, y: 344, w: 48, h: 112 },
    loot: { x: 1010, y: 360, type: 'gem', label: 'STAR OF VESPER' },
    paths: [{x:60,y:286,w:1120,h:148,kind:'left'},{x:60,y:310,w:1120,h:100,kind:'middle'},{x:60,y:400,w:1120,h:250,kind:'right'}],
    walls: [
      {x:0,y:0,w:1280,h:24},{x:0,y:696,w:1280,h:24},
      {x:0,y:24,w:24,h:672},{x:1256,y:24,w:24,h:260},{x:1256,y:436,w:24,h:260},
      {x:286,y:82,w:26,h:176},{x:286,y:462,w:26,h:176},
      {x:668,y:24,w:24,h:192},{x:668,y:504,w:24,h:192},
      {x:880,y:236,w:28,h:110},{x:880,y:374,w:28,h:110}
    ],
    cover: [
      {x:374,y:118,w:84,h:58,type:'case'},{x:414,y:544,w:104,h:60,type:'crate'},
      {x:554,y:286,w:72,h:46,type:'rope'},{x:554,y:390,w:72,h:46,type:'rope'},
      {x:724,y:108,w:60,h:70,type:'plant'},{x:748,y:544,w:64,h:70,type:'plant'},
      {x:934,y:126,w:68,h:56,type:'case'},{x:1062,y:532,w:82,h:62,type:'crate'}
    ],
    guards: [
      {x:460,y:358,speed:72,waypoints:[{x:360,y:350},{x:550,y:350},{x:550,y:438},{x:360,y:438}]},
      {x:738,y:356,speed:66,waypoints:[{x:716,y:260},{x:824,y:260},{x:824,y:454},{x:716,y:454}]},
      {x:1034,y:250,speed:76,waypoints:[{x:1000,y:250},{x:1150,y:250},{x:1150,y:480},{x:1000,y:480}]}
    ],
    cameras: [
      {x:180,y:42,angle:0.28,base:0.28,sweep:0.95,range:340,fov:0.72},
      {x:626,y:678,angle:-1.2,base:-1.2,sweep:0.82,range:310,fov:0.7},
      {x:1096,y:42,angle:1.9,base:1.9,sweep:0.8,range:300,fov:0.68}
    ]
  },
  {
    name: 'The Black Vault', objective: 'Pick the vault for three seconds, take the Moon Coin, and escape.',
    hint: 'Hold still beside the safe to pick it. A pebble can pull the patrol away.',
    spawn: { x: 106, y: 360 }, exit: { x: 1192, y: 344, w: 48, h: 112 },
    loot: { x: 1022, y: 360, type: 'safe', label: 'MOON COIN' },
    paths: [{x:60,y:268,w:1120,h:150,kind:'left'},{x:60,y:300,w:1120,h:110,kind:'middle'},{x:60,y:412,w:1120,h:242,kind:'right'}],
    walls: [
      {x:0,y:0,w:1280,h:24},{x:0,y:696,w:1280,h:24},{x:0,y:24,w:24,h:672},
      {x:1256,y:24,w:24,h:260},{x:1256,y:436,w:24,h:260},
      {x:272,y:24,w:24,h:214},{x:272,y:482,w:24,h:214},
      {x:646,y:148,w:26,h:188},{x:646,y:384,w:26,h:210},
      {x:846,y:24,w:24,h:194},{x:846,y:502,w:24,h:194},
      {x:936,y:286,w:28,h:82},{x:936,y:398,w:28,h:82}
    ],
    cover: [
      {x:342,y:120,w:100,h:62,type:'crate'},{x:342,y:536,w:100,h:62,type:'crate'},
      {x:510,y:278,w:72,h:50,type:'plant'},{x:510,y:392,w:72,h:50,type:'plant'},
      {x:712,y:88,w:76,h:58,type:'case'},{x:712,y:574,w:76,h:58,type:'case'},
      {x:900,y:196,w:62,h:58,type:'crate'},{x:900,y:466,w:62,h:58,type:'crate'},
      {x:1070,y:152,w:68,h:56,type:'plant'},{x:1070,y:512,w:68,h:56,type:'plant'}
    ],
    guards: [
      {x:426,y:352,speed:74,waypoints:[{x:332,y:254},{x:560,y:254},{x:560,y:450},{x:332,y:450}]},
      {x:750,y:350,speed:70,waypoints:[{x:700,y:248},{x:812,y:248},{x:812,y:470},{x:700,y:470}]},
      {x:1092,y:358,speed:78,waypoints:[{x:1000,y:300},{x:1170,y:300},{x:1170,y:426},{x:1000,y:426}]}
    ],
    cameras: [
      {x:190,y:42,angle:0.35,base:0.35,sweep:0.9,range:360,fov:0.72},
      {x:604,y:678,angle:-1.3,base:-1.3,sweep:0.92,range:340,fov:0.72},
      {x:1040,y:42,angle:1.8,base:1.8,sweep:0.75,range:320,fov:0.7}
    ]
  },
  {
    name: 'The Rooftop Getaway', objective: 'Claim the Moonstone and getaway bag, then reach the waiting lift.',
    hint: 'The rooftop is exposed. Use the air vents and plan your dash between camera sweeps.',
    spawn: { x: 106, y: 360 }, exit: { x: 1192, y: 344, w: 48, h: 112 },
    loot: { x: 1012, y: 360, type: 'moonstone', label: 'MOONSTONE + BAG' },
    paths: [{x:60,y:260,w:1120,h:170,kind:'left'},{x:60,y:300,w:1120,h:120,kind:'middle'},{x:60,y:414,w:1120,h:240,kind:'right'}],
    walls: [
      {x:0,y:0,w:1280,h:24},{x:0,y:696,w:1280,h:24},{x:0,y:24,w:24,h:672},
      {x:1256,y:24,w:24,h:260},{x:1256,y:436,w:24,h:260},
      {x:300,y:78,w:28,h:176},{x:300,y:468,w:28,h:174},
      {x:626,y:24,w:26,h:194},{x:626,y:502,w:26,h:194},
      {x:836,y:198,w:26,h:142},{x:836,y:380,w:26,h:152},
      {x:942,y:24,w:24,h:188},{x:942,y:508,w:24,h:188}
    ],
    cover: [
      {x:374,y:124,w:86,h:58,type:'crate'},{x:382,y:538,w:92,h:60,type:'crate'},
      {x:516,y:280,w:84,h:48,type:'plant'},{x:516,y:396,w:84,h:48,type:'plant'},
      {x:700,y:104,w:84,h:54,type:'case'},{x:700,y:562,w:84,h:54,type:'case'},
      {x:876,y:124,w:52,h:64,type:'plant'},{x:876,y:532,w:52,h:64,type:'plant'},
      {x:1056,y:186,w:72,h:54,type:'crate'},{x:1056,y:480,w:72,h:54,type:'crate'}
    ],
    guards: [
      {x:450,y:350,speed:82,waypoints:[{x:350,y:250},{x:568,y:250},{x:568,y:454},{x:350,y:454}]},
      {x:740,y:352,speed:76,waypoints:[{x:690,y:248},{x:810,y:248},{x:810,y:468},{x:690,y:468}]},
      {x:1082,y:358,speed:86,waypoints:[{x:992,y:272},{x:1168,y:272},{x:1168,y:450},{x:992,y:450}]},
      {x:638,y:360,speed:68,waypoints:[{x:540,y:350},{x:740,y:350},{x:740,y:430},{x:540,y:430}]}
    ],
    cameras: [
      {x:186,y:42,angle:0.3,base:0.3,sweep:0.95,range:370,fov:0.74},
      {x:588,y:678,angle:-1.28,base:-1.28,sweep:0.94,range:355,fov:0.72},
      {x:1102,y:42,angle:1.95,base:1.95,sweep:0.85,range:340,fov:0.72}
    ]
  }
];
