if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let r={};const t=e=>c(e,n),b={module:{uri:n},exports:r,require:t};s[n]=Promise.all(a.map((e=>b[e]||t(e)))).then((e=>(i(...e),r)))}}define(["./workbox-cf9e2b60"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Lato-Black.woff2",revision:"bba14d8e8287260cc05c9b49ad74eda6"},{url:"/Lato-Bold.woff2",revision:"25583230b7fa52a5aa215dedae394a2c"},{url:"/Lato-Regular.woff2",revision:"ae05cb2ad509482faafc41f4f6c86220"},{url:"/Sabo-Filled.otf",revision:"92339ee0b5016accb9cb65787c60e628"},{url:"/_next/static/MUbRXZxkyPfaih570d-YU/_buildManifest.js",revision:"49f2fb1ad235fb38778afe7cd4db8cb3"},{url:"/_next/static/MUbRXZxkyPfaih570d-YU/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1094.d87521f8f7f6b2e6.js",revision:"d87521f8f7f6b2e6"},{url:"/_next/static/chunks/1139.d15466ddd7bcd3db.js",revision:"d15466ddd7bcd3db"},{url:"/_next/static/chunks/1576.3b2c4cae17a82eff.js",revision:"3b2c4cae17a82eff"},{url:"/_next/static/chunks/1923.da853894eada050f.js",revision:"da853894eada050f"},{url:"/_next/static/chunks/1953.ee99fbe33bd7b6c8.js",revision:"ee99fbe33bd7b6c8"},{url:"/_next/static/chunks/2077.aef4d028e7f53252.js",revision:"aef4d028e7f53252"},{url:"/_next/static/chunks/2344.ecf445990c6c17da.js",revision:"ecf445990c6c17da"},{url:"/_next/static/chunks/250.a3c28b054d396afb.js",revision:"a3c28b054d396afb"},{url:"/_next/static/chunks/2526.0e87be8e84eb52b2.js",revision:"0e87be8e84eb52b2"},{url:"/_next/static/chunks/2550.84c71892a6c93153.js",revision:"84c71892a6c93153"},{url:"/_next/static/chunks/2677.7861903427aae5fa.js",revision:"7861903427aae5fa"},{url:"/_next/static/chunks/2764.131df822b38b4bf5.js",revision:"131df822b38b4bf5"},{url:"/_next/static/chunks/2809.8a868711105ae453.js",revision:"8a868711105ae453"},{url:"/_next/static/chunks/2835.de57e12b9094d559.js",revision:"de57e12b9094d559"},{url:"/_next/static/chunks/2913.087ba08f87e8559d.js",revision:"087ba08f87e8559d"},{url:"/_next/static/chunks/2947.bc378369c0ca7d10.js",revision:"bc378369c0ca7d10"},{url:"/_next/static/chunks/2960.7981e1cc759d9bfc.js",revision:"7981e1cc759d9bfc"},{url:"/_next/static/chunks/3026-4ca2e44a2641047d.js",revision:"4ca2e44a2641047d"},{url:"/_next/static/chunks/3250.0c35a1bd8093299f.js",revision:"0c35a1bd8093299f"},{url:"/_next/static/chunks/3495.52c92518c77fb862.js",revision:"52c92518c77fb862"},{url:"/_next/static/chunks/3795.772566eecfa5ba77.js",revision:"772566eecfa5ba77"},{url:"/_next/static/chunks/3797.3632ef5f9bc8ee21.js",revision:"3632ef5f9bc8ee21"},{url:"/_next/static/chunks/3850.67944b2a1cc77b2f.js",revision:"67944b2a1cc77b2f"},{url:"/_next/static/chunks/4061.4f575078dead8644.js",revision:"4f575078dead8644"},{url:"/_next/static/chunks/4121-45bb4c4644f9edb8.js",revision:"45bb4c4644f9edb8"},{url:"/_next/static/chunks/4261-5e4676224f5d9ec1.js",revision:"5e4676224f5d9ec1"},{url:"/_next/static/chunks/4378.192802704622e2a2.js",revision:"192802704622e2a2"},{url:"/_next/static/chunks/4503.f1c040562426d277.js",revision:"f1c040562426d277"},{url:"/_next/static/chunks/4522.88288fe53bad7bd2.js",revision:"88288fe53bad7bd2"},{url:"/_next/static/chunks/4550.2f689c5210bcf161.js",revision:"2f689c5210bcf161"},{url:"/_next/static/chunks/4615.cbfcba4617b6efbf.js",revision:"cbfcba4617b6efbf"},{url:"/_next/static/chunks/4752.bcc16c9a102cd332.js",revision:"bcc16c9a102cd332"},{url:"/_next/static/chunks/4781.55f3e4ca810eeb9e.js",revision:"55f3e4ca810eeb9e"},{url:"/_next/static/chunks/4869-c105ea82686cdc0d.js",revision:"c105ea82686cdc0d"},{url:"/_next/static/chunks/4895.35250cb9ba874c78.js",revision:"35250cb9ba874c78"},{url:"/_next/static/chunks/5027-a217601f3adb8910.js",revision:"a217601f3adb8910"},{url:"/_next/static/chunks/5087.c240a39578a2eaf0.js",revision:"c240a39578a2eaf0"},{url:"/_next/static/chunks/5204.f40b4c5cf9de2d28.js",revision:"f40b4c5cf9de2d28"},{url:"/_next/static/chunks/5399.f3d8505542ed218d.js",revision:"f3d8505542ed218d"},{url:"/_next/static/chunks/5483.64df71dac46619ec.js",revision:"64df71dac46619ec"},{url:"/_next/static/chunks/5541.27313773beae0336.js",revision:"27313773beae0336"},{url:"/_next/static/chunks/5547-95fc70c0e296b4f2.js",revision:"95fc70c0e296b4f2"},{url:"/_next/static/chunks/577.48da575f1a6c1ed9.js",revision:"48da575f1a6c1ed9"},{url:"/_next/static/chunks/5898.233f6bd010904e2b.js",revision:"233f6bd010904e2b"},{url:"/_next/static/chunks/5976.939f335fc557ae91.js",revision:"939f335fc557ae91"},{url:"/_next/static/chunks/6017.dd0fcedacb89ebd9.js",revision:"dd0fcedacb89ebd9"},{url:"/_next/static/chunks/6138.aaea9859fc8cace0.js",revision:"aaea9859fc8cace0"},{url:"/_next/static/chunks/6166.aff9b3e24e0c38c1.js",revision:"aff9b3e24e0c38c1"},{url:"/_next/static/chunks/6212-5289c02e20338a28.js",revision:"5289c02e20338a28"},{url:"/_next/static/chunks/6221.4ad26444cc83bb50.js",revision:"4ad26444cc83bb50"},{url:"/_next/static/chunks/6279.cece1ececcf485c8.js",revision:"cece1ececcf485c8"},{url:"/_next/static/chunks/638.fdb5873383f06eeb.js",revision:"fdb5873383f06eeb"},{url:"/_next/static/chunks/6497.6c6f89640c7d4643.js",revision:"6c6f89640c7d4643"},{url:"/_next/static/chunks/6579.56b6b706b0d4b07a.js",revision:"56b6b706b0d4b07a"},{url:"/_next/static/chunks/6586.5684931990e9413d.js",revision:"5684931990e9413d"},{url:"/_next/static/chunks/6899.ad60e2c80fbebd40.js",revision:"ad60e2c80fbebd40"},{url:"/_next/static/chunks/715-9b624ff2405baf56.js",revision:"9b624ff2405baf56"},{url:"/_next/static/chunks/7160-ce96b01e13ca2556.js",revision:"ce96b01e13ca2556"},{url:"/_next/static/chunks/7474.49beec956a53eca3.js",revision:"49beec956a53eca3"},{url:"/_next/static/chunks/7475.2f40829a6b9c5265.js",revision:"2f40829a6b9c5265"},{url:"/_next/static/chunks/7521.afb0b20ad6a4ef55.js",revision:"afb0b20ad6a4ef55"},{url:"/_next/static/chunks/7809.6f9b476733f82ff2.js",revision:"6f9b476733f82ff2"},{url:"/_next/static/chunks/8105.5e180476271bad18.js",revision:"5e180476271bad18"},{url:"/_next/static/chunks/8268.c65063f4eccdf4d8.js",revision:"c65063f4eccdf4d8"},{url:"/_next/static/chunks/8427.a48ba8b0e3ff3e1f.js",revision:"a48ba8b0e3ff3e1f"},{url:"/_next/static/chunks/8498.8ed31a173e4dc9bd.js",revision:"8ed31a173e4dc9bd"},{url:"/_next/static/chunks/8578.ca47087aabca883a.js",revision:"ca47087aabca883a"},{url:"/_next/static/chunks/8602.a3bbfd22c4ab8003.js",revision:"a3bbfd22c4ab8003"},{url:"/_next/static/chunks/8612.a2008a76d332a21f.js",revision:"a2008a76d332a21f"},{url:"/_next/static/chunks/8633.814165b5d9fc3343.js",revision:"814165b5d9fc3343"},{url:"/_next/static/chunks/8681.f968d174433279ff.js",revision:"f968d174433279ff"},{url:"/_next/static/chunks/8834.00abb53e4398a70b.js",revision:"00abb53e4398a70b"},{url:"/_next/static/chunks/8898.60b61c5d0ee59cc8.js",revision:"60b61c5d0ee59cc8"},{url:"/_next/static/chunks/9092-a0c3c88ff7f1c854.js",revision:"a0c3c88ff7f1c854"},{url:"/_next/static/chunks/9194-00d1dc222b9847b2.js",revision:"00d1dc222b9847b2"},{url:"/_next/static/chunks/9291.f2fa8bd191056856.js",revision:"f2fa8bd191056856"},{url:"/_next/static/chunks/9382.0ec28414d7b260d3.js",revision:"0ec28414d7b260d3"},{url:"/_next/static/chunks/9441.6d7f927c9968e7c0.js",revision:"6d7f927c9968e7c0"},{url:"/_next/static/chunks/9520.4dda7c3aff078132.js",revision:"4dda7c3aff078132"},{url:"/_next/static/chunks/9584.8ab4703482906b15.js",revision:"8ab4703482906b15"},{url:"/_next/static/chunks/9617.c8cf96bb321809ee.js",revision:"c8cf96bb321809ee"},{url:"/_next/static/chunks/9733.9855e59ec3a3f4b7.js",revision:"9855e59ec3a3f4b7"},{url:"/_next/static/chunks/9851.e8553fcbf84dde8e.js",revision:"e8553fcbf84dde8e"},{url:"/_next/static/chunks/9870.b8a7ad9e1b831c94.js",revision:"b8a7ad9e1b831c94"},{url:"/_next/static/chunks/9897.774ae2c8b7a9a4cb.js",revision:"774ae2c8b7a9a4cb"},{url:"/_next/static/chunks/9914-83c89b9c1d151f30.js",revision:"83c89b9c1d151f30"},{url:"/_next/static/chunks/a29ae703-553be40ece9b2d7e.js",revision:"553be40ece9b2d7e"},{url:"/_next/static/chunks/a570723b.c44d374b0df91ba5.js",revision:"c44d374b0df91ba5"},{url:"/_next/static/chunks/b155a556-bac304f90e0676fc.js",revision:"bac304f90e0676fc"},{url:"/_next/static/chunks/framework-5ccd8d6d85c444a9.js",revision:"5ccd8d6d85c444a9"},{url:"/_next/static/chunks/main-97d0408dd96170b4.js",revision:"97d0408dd96170b4"},{url:"/_next/static/chunks/pages/404-2686cb2905d66eef.js",revision:"2686cb2905d66eef"},{url:"/_next/static/chunks/pages/_app-8cdc9d0d889e83c0.js",revision:"8cdc9d0d889e83c0"},{url:"/_next/static/chunks/pages/_error-76385da1cf67b566.js",revision:"76385da1cf67b566"},{url:"/_next/static/chunks/pages/contest/%5Bchain%5D/%5Baddress%5D-81b1f2b08b681c0d.js",revision:"81b1f2b08b681c0d"},{url:"/_next/static/chunks/pages/contest/%5Bchain%5D/%5Baddress%5D/submission/%5Bsubmission%5D-33360b4a5d24355e.js",revision:"33360b4a5d24355e"},{url:"/_next/static/chunks/pages/contest/new-afffaaa9126476cd.js",revision:"afffaaa9126476cd"},{url:"/_next/static/chunks/pages/contests-e32633eef8498730.js",revision:"e32633eef8498730"},{url:"/_next/static/chunks/pages/contests/live-5aa357692ab3133b.js",revision:"5aa357692ab3133b"},{url:"/_next/static/chunks/pages/contests/past-b6a504e5f233cb90.js",revision:"b6a504e5f233cb90"},{url:"/_next/static/chunks/pages/contests/upcoming-c407bd677ddb3d6f.js",revision:"c407bd677ddb3d6f"},{url:"/_next/static/chunks/pages/index-c9cdce420e65d4ae.js",revision:"c9cdce420e65d4ae"},{url:"/_next/static/chunks/pages/user/%5Baddress%5D-e331ef0fb68bbfa0.js",revision:"e331ef0fb68bbfa0"},{url:"/_next/static/chunks/pages/user/%5Baddress%5D/submissions-a46206af8251d2fb.js",revision:"a46206af8251d2fb"},{url:"/_next/static/chunks/pages/user/%5Baddress%5D/votes-0bef4beeb0f2f941.js",revision:"0bef4beeb0f2f941"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-72288fb5b197d235.js",revision:"72288fb5b197d235"},{url:"/_next/static/css/6b3fc75b63a50e27.css",revision:"6b3fc75b63a50e27"},{url:"/_next/static/css/7e5f450b96ab63fd.css",revision:"7e5f450b96ab63fd"},{url:"/_next/static/css/e87ba7dcee6d9606.css",revision:"e87ba7dcee6d9606"},{url:"/arbitrum.svg",revision:"723466e885b7959fad838562cb1c469a"},{url:"/aurora.svg",revision:"809aa97ee42bc5f0b11e85c622b0a45c"},{url:"/avalanche.png",revision:"7a46ec506e53427e314db05f78f37b27"},{url:"/base.svg",revision:"271c71d5302f796825d236320142327f"},{url:"/celo.svg",revision:"a18fca4b18c82f6b7832a4703ed38561"},{url:"/contest/avatar.svg",revision:"640d066927b730c6e4774cb99f2eb74b"},{url:"/contest/ballot.svg",revision:"6e50e973d386d7d1ce0d106d63ceb3ee"},{url:"/contest/chevron.svg",revision:"711ac6a15197866cdbc8c53a4dfc2c65"},{url:"/contest/dancing-dance.gif",revision:"3150b2084513de6630b29bcbe33a11bf"},{url:"/contest/mona-lisa-moustache.png",revision:"aa43af0f88aef7f07dac5b3ce4c6fbf5"},{url:"/contest/next-entry-mobile.svg",revision:"713f9f74fc50c24ecba206263f3dbf3b"},{url:"/contest/next-entry.svg",revision:"f7461841433598df81e0128e86fa4bb0"},{url:"/contest/previous-entry-mobile.svg",revision:"5428ec07a12ca39696b3da58bc4928a1"},{url:"/contest/previous-entry.svg",revision:"b3b41d216a06691429787de116146b94"},{url:"/contest/timer.svg",revision:"31e70275bdee18ac6999a7e762a4d850"},{url:"/contest/wallet-entry-insufficient.svg",revision:"35f420cef3f13d61c1939ca3304d8a43"},{url:"/contest/wallet-entry.svg",revision:"9621c343396fde9ccbcc53f9df4d6d3a"},{url:"/create-flow/back.svg",revision:"77dffec90ae6718c3438ef6174bb7742"},{url:"/create-flow/back_mobile.svg",revision:"cf8bf482f375358564a5c20fff3d5338"},{url:"/create-flow/calendar.png",revision:"a0cc0265bd498ba7a3e42e319f7b85d3"},{url:"/create-flow/csv_upload.png",revision:"a5eaf12b1c7248ed93eaecb591ecb7f0"},{url:"/create-flow/enter.svg",revision:"343f640563876b0d34c80ebba7c6b50a"},{url:"/create-flow/shift.png",revision:"efde075c9225522084d0d4e6ecef99e7"},{url:"/create-flow/success.png",revision:"9cb22d6b5553e38fabc5f08286aece95"},{url:"/create-flow/trashcan.png",revision:"099ea3d6576245edd5f036915648dc08"},{url:"/create-flow/upload.png",revision:"75b274e7b60f50403f525b7026cfde74"},{url:"/degen.png",revision:"374273049ea2599291202138686b0607"},{url:"/eos.svg",revision:"b25922edc00a8e251eeb7abe68f862cf"},{url:"/ethereum.svg",revision:"b1b5b7ac99d00d440694dbb0c00cbb11"},{url:"/etherscan.svg",revision:"3a6c7a933534350e44908028afc9f5b6"},{url:"/evmos.svg",revision:"0c35f1164235fcbeefd5658be0438247"},{url:"/explainer/Arrow1.svg",revision:"1c69f7e7028b0bc0b804788877707185"},{url:"/explainer/Arrow2.svg",revision:"38a6a547957c87662f187c0512e990bd"},{url:"/explainer/Arrow3.svg",revision:"6b05f7a10a7b5fa677ec374221375b75"},{url:"/explainer/Arrow4.svg",revision:"aa8fded58056345048fa5aa43a0312b2"},{url:"/explainer/Arrow5.svg",revision:"6d32f2a42e7ebb3dbafba680083588ad"},{url:"/explainer/Ellipse1.svg",revision:"09af8c07cc980fb051977ba9537c4160"},{url:"/explainer/Ellipse2.svg",revision:"e45a0547002cdabb2f1bb17450d7be19"},{url:"/explainer/Ellipse3.svg",revision:"d9c811f2e8a51926da492f5cd582e44e"},{url:"/explainer/Ellipse4.svg",revision:"e991b672a35fb35ea2dfd85a4e0a9317"},{url:"/explainer/Ellipse5.svg",revision:"f94c821a9afc6da6daefc46a63a5b240"},{url:"/explainer/bg-1.svg",revision:"9c8ac29d58482ed1203e18ee124e5563"},{url:"/explainer/bg-2.svg",revision:"50c36d9e20f84f455efb6175fed9323c"},{url:"/explainer/bg-3.svg",revision:"e55762d4e6e84eb611b0bff7db764325"},{url:"/explainer/small-ellipse-gray.svg",revision:"4665bdb5b2eb368bc81cb8453ba48f42"},{url:"/explainer/small-ellipse.svg",revision:"ad22a11464c44806bc73167880115464"},{url:"/fantom.png",revision:"d20dabdaf4fb40d6cd1670c4e4d4e8e6"},{url:"/favicon.png",revision:"554b99add4c51852dc31a28d38da2713"},{url:"/forward.svg",revision:"da1b90b0a0069414602e3f7474c4d13e"},{url:"/fuse.svg",revision:"b7f537eccd8d4ffcccc35d67ddc6f4d4"},{url:"/gnosis.png",revision:"2a6450420bb442c7204455f25cee836f"},{url:"/hardhat.svg",revision:"9cd1e15f24de14f6b6f57f568fe5ecee"},{url:"/harmony.png",revision:"dd945eb434fb9fe3465b907a717642e3"},{url:"/header/create.svg",revision:"026510e2af48c111873651089d6820ba"},{url:"/header/search.svg",revision:"1ce233de9c459239afd98248ab531202"},{url:"/header/trophy.svg",revision:"c070a0def883e536336bee698a9f0e56"},{url:"/header/wallet-connected.svg",revision:"14b57e88e51b830620b1e0d246565d17"},{url:"/header/wallet.svg",revision:"743852b100c49b738e95039fd5abfe35"},{url:"/icon-192x192.png",revision:"8b94eb7245b693706be63db487131c8d"},{url:"/icon-256x256.png",revision:"ad8acb3d39c2dce7968c2f7b362b80b7"},{url:"/icon-384x384.png",revision:"02d2589f46672b6b5d5493e25cf3750d"},{url:"/icon-512x512.png",revision:"64e22bb39528c0890cf997f407db6aab"},{url:"/jokerace.png",revision:"5cc956b367c238e13d7dd42b891c12ae"},{url:"/kroma.svg",revision:"468dad7aa281b394f5de44cc905c48d7"},{url:"/linea.svg",revision:"542a3d975679ecadb5fbbada6a1fbd74"},{url:"/lit.svg",revision:"83be228a1e1808bc7e6ca015e08a2717"},{url:"/lootchain.svg",revision:"a763a38d79a9e82428ffd8a230e48a83"},{url:"/lukso.svg",revision:"65c64bba61d8135e90417ca010150fc1"},{url:"/manifest.json",revision:"7bc50a140ece6e3b3fff2974d70c8d6e"},{url:"/mantaPacific.svg",revision:"c7cef759c6dbf84fc3cc3180643fa50f"},{url:"/mantle.svg",revision:"01f34c87fc8bfc765a1c12c10c91efe6"},{url:"/modal/modal_close.svg",revision:"e9908fac2499175da34ab52c22e66c21"},{url:"/nautiluschain.png",revision:"ec8641bd841ab37ebb2d6b79c808e723"},{url:"/optimism.svg",revision:"b4ec70dd4a0b9ba9765a8edb01ab9a20"},{url:"/polygon.svg",revision:"747ec6f4561ca8099e012d4389be00e2"},{url:"/powered-by-vercel.svg",revision:"b92e4d8d4e56833d0174e2ddf856b287"},{url:"/publicgoodsnetwork.svg",revision:"a95f793480788c6f7995e91897a02884"},{url:"/qchain.svg",revision:"53bea91ca4635cbb16fb32cded41d829"},{url:"/quartz.svg",revision:"72033078c72ce1f4faeb69bd25a6419a"},{url:"/rewards/distributed-ellipse.svg",revision:"deb84ebdf62b4d72a0a3bde369ac4487"},{url:"/rewards/no-funds-distributed-ellipse.svg",revision:"49113529f1280dd1307fe6e6ed883572"},{url:"/scroll.png",revision:"08bf8ead2c4440bbf05dde8329b8834d"},{url:"/socials/lens-leaf.svg",revision:"1eb3fb29735e7fb8c9ff728f26471fce"},{url:"/socials/lens.svg",revision:"ea10557c908e3c5a240c5290b7efb020"},{url:"/socials/share-submission/facebook.svg",revision:"c924a676b6ff6e8456ceef348f9194c4"},{url:"/socials/share-submission/instagram.svg",revision:"be9f973e4273d4aa5170c62a3ab71d2e"},{url:"/socials/share-submission/lens.svg",revision:"6b18ad63121ee75cb2f84d86750efb5c"},{url:"/socials/share-submission/linkedin.svg",revision:"914fcdd5166bdba4c6647d01b82a0099"},{url:"/socials/share-submission/twitter.svg",revision:"8747ce4d88f4ef05d093ea784ab74f5d"},{url:"/socials/twitter-light.svg",revision:"2c4adf56e9efaa9bab9f22039149476c"},{url:"/socials/twitter.svg",revision:"37caa6621fbf99d618c438b5a3c3ca5e"},{url:"/toast/sadboi.png",revision:"b1b6d508b72ce7f32c927f4fc93d297f"},{url:"/toast/success.svg",revision:"5c3a6c4bd7c20272abfa26602ead76d6"},{url:"/tokens/ether.svg",revision:"a7d169c8a324941db14262bceec1f635"},{url:"/tokens/usdc.svg",revision:"3b5972c16a9795dcf6e2e2d7e3125d21"},{url:"/unique.svg",revision:"b350acf55ef123f8ce9c323b01ac9efe"},{url:"/user/private.svg",revision:"08c38c6465e317fc1b8ce7ee9610406d"},{url:"/user/public.svg",revision:"0421e1dc854432aee3765a51f3517c60"},{url:"/vitruveo.svg",revision:"ecd5a7227fb9c181cb8ab846c118ac6e"},{url:"/zeta.svg",revision:"1eeddaec89de363249bbf8fcc7997500"},{url:"/zora.png",revision:"e8d78bd6c2cd3664271e5e790f3d84a9"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
