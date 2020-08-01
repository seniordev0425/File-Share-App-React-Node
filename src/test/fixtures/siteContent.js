import { PathDetails, FileOrFolder } from 'store/modules/siteContent'


export const pathDetails = PathDetails({
  type: "file",
  name: "MyTestServer",
  domain: "imfast.io",
  server: "mygoogledriveserver.imfast.io",
  storage: "googledrive",
  details: FileOrFolder({
     id: "id:qSZH8F7zKAAAAAAAAAAAHQ",
     name: "test.png",
     size: 211522,
     path: "/MyFolder/test.png",
     mime: "image/png",
     category: 3,
     url: "https://MyTestServer.imfast.io/MyFolder/test.png",
     origin_url: "https://drive.google.com/file/1KOaj_tpd98",
     filtered: false,
     modified: "2018-04-23 15:22:58 UTC",
     cached: "2018-04-23 15:29:32 UTC"
  }),
})

export const folderRecord = FileOrFolder({
  cached: '2019-04-05 15:52:30 UTC',
  id: '13dr4Mxt4yBmpyQPTDsvS4QSzreIsDKRv',
  modified: '2019-04-05 15:51:41 UTC',
  name: 'how-it-works',
  url: 'https://drive.google.com/drive/folders/13dr4Mxt4yBmpyQPTDsvS4QSzreIsDKRv',
  path: '/src/images/how-it-works',
  type: 'folder',
  url: 'https://ryan01.imfastdev2.com/src/images/how-it-works/'
})

export const fileRecord = FileOrFolder({
  cached: '2019-04-05 15:52:30 UTC',
  category: 3,
  id: '142ukl7_vW7qsMPePoRpqgNv0Z74WqNlf',
  mime: 'image/jpeg',
  modified: '2019-04-05 15:52:00 UTC',
  name: 'how-it-works-banner.jpg',
  url: 'https://drive.google.com/a/fast.io/file/d/142ukl7_vW7qsMPePoRpqgNv0Z74WqNlf/view?usp=drivesdk',
  path: '/src/images/how-it-works-banner.jpg',
  size: '101379',
  type: 'file',
  url: 'https://ryan01.imfastdev2.com/src/images/how-it-works-banner.jpg'
})
