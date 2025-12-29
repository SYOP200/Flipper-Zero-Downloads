# Gas Station Price Sign captures by [0day](https://github.com/0dayCTF)

## REMINDER: This is likely illegal unless you own the sign!

Captured remote is [GL-OIL-RF](https://olympianled.com/product/gas-price-changer-rf-remote-control-gl-oil-rf/). The [PDF manual](https://github.com/UberGuidoZ/Flipper/blob/main/Sub-GHz/Gas_Sign/Manual_GL-OIL-RF.pdf) is also available and contains programming instructions.

----------

Use the `Edit_mode.sub` to enable editing, then you can use the other SUB files for programming. See the manual above.<br>
If you're runing an unlocked or custom firmware with UniRF, then you can [use this map](https://github.com/UberGuidoZ/Flipper/blob/main/unirf/Gas_Sign_Edit.txt) to easily edit on the fly.

----------

More work on this to be done! These captures are locked to the 20110120 code but can be [physically changed](https://olympianled.com/changing-remote-code/):

```
Our remote code is 20110120. As you can see from the pictures below: 

L1 = 2

No solder = 0

1H = 1

The receiver inside of your sign needs to match the remote code, so you’ll have to look at the receiver
inside of the sign that is attached to the GL_GMAN board. Here is a picture of the receiver for reference,
you can see it’s also matching our 20110120 code.
```

More info from hahalolha (#5124) via Discord (thanks for the DM!):

"I believe I have found the [OEM manufacturer](http://m.glareled.com/). (This is the mobile site link as it appears their desktop site is offline, at least for me). I got this link from support chat on the site provided on your Github. Their Gas Station section [is here](http://m.glareled.com/h-pr.html?mid=527&groupId=69) and the page with the most info relevant to us [is here](http://m.glareled.com/h-pd-196.html#mid=3&groupId=69&desc=false). [This is also an interesting image](http://16958556.s21i.faiusr.com/4/ABUIABAEGAAgivuBlQYo5K-3dzCXBzjMAw!900x900.png.webp) I've found so far. I was originally trying to find which frequencies they use worldwide so I could hopefully create different versions for models around the world."

More info from alejandro12120 (#8100):

"Here is the [OEM manufacturer desktop site](https://www.glare-led.com/). Also here is the relevant [website](https://www.glare-led.com/h-col-132.html#project-case), those pictures are some examples where the gas sign is installed."

Receiver

![Remote_Receiver](https://user-images.githubusercontent.com/57457139/182993141-0f2a725b-036a-4b15-b38b-15c7e4177735.png)

Remote

![Remote_Back](https://user-images.githubusercontent.com/57457139/182993143-c4e261c7-c986-4a11-b17d-ed394d3953ba.png)

-----
