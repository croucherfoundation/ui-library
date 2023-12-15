# Croucher centralize css component library

This is the main css library for croucher org websites. It supports the whole styles and standard styling guide for croucher org website. In this project **scss** is the main preprocessing tools for styling. Here are the lists of classes currently avaliable.

## Spacing

| No. | Class names            | Css values | Places to use |
| :-- | :--------------------- | :--------- | :------------ |
| 1.  | mt_viewall_btn_wrapper |            |               |
| 2   | mb_viewall_btn_wrapper |            |               |
| 3   | pt_title               |            |               |
| 4.  | pb_title               |            |               |
| 5.  | pb_standfirst          |            |               |
| 6.  | mb_subtitle            |            |               |
| 7.  | mt_subbox              |            |               |
| 8.  | mb_subbox              |            |               |

---

## Container & layouts

| No. | Class names              | Places to use                                                     |
| :-- | :----------------------- | :---------------------------------------------------------------- |
| 1.  | card_container           | cards column layout container ......\[3:lg,2:md,1:sm] grid layout |
| 2.  | card_container--trustees | cards column layout container ......\[4:lg,2:md,1:sm] grid layout |

---

## Cards

| No. | Class names  | Places to use                                  |
| :-- | :----------- | :--------------------------------------------- |
| 1.  | default_card | default croucher card with image and body text |
|     |              |                                                |

### Default card sample html structure

```html
<a href="#" class="default_card">
  <div class="img_container">
    <img
      src="https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU"
      alt=""
    />
    <div class="card_badge">Lorem, ipsum dolor.</div>
  </div>
  <div class="body_container">
    <h3 class="card_title">Lorem ipsum dolor sit amet.</h3>
    <p class="card_desc">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum magnam,
      autem voluptas illo excepturi maxime reprehenderit amet earum vero
      deleniti odio quia possimus totam illum ipsam consequatur doloremque,
      aperiam modi a omnis voluptatum debitis aliquid? Nemo repudiandae sit
      recusandae molestias.
    </p>
  </div>
</a>
```

---
