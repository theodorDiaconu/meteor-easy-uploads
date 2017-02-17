S3 Upload Module
==========================

Clone it into your packages folder. And modify it however you wish.

Here is what you need to do to get it up and running:

## Configure AWS S3

In settings json:
```json
  "private": {
    "aws": {
      "key": "x",
      "secret": "x",
      "bucket": "x",
      "region": "x",
      "url": "http://x"
    }
  },
```


- Secure your uploads via routes and users
- Implement the delete file method
- Check client-samples to see how it works with Blaze & Dropzone
