export const preloaderFrames = [
`[>                        ]`,
`[=>                       ]`,
`[==>                      ]`,
`[===>                     ]`,
`[====>                    ]`,
`[=====>                   ]`,
`[======>                  ]`,
`[=======>                 ]`,
`[========>                ]`,
`[=========>               ]`,
`[==========>              ]`,
`[===========>             ]`,
`[============>            ]`,
`[=============>           ]`,
`[==============>          ]`,
`[===============>         ]`,
`[================>        ]`,
`[=================>       ]`,
`[==================>      ]`,
`[===================>     ]`,
`[====================>    ]`,
`[=====================>   ]`,
`[======================>  ]`,
`[=======================> ]`,
`[========================>]`,
`
SYSTEM.INIT...OK
NEFAS.TV v1.0
LOADING INTERFACE...
`,
`
SYSTEM.INIT...OK
NEFAS.TV v1.0
LOADING INTERFACE...
...RENDERING TRASH
`
];

export const initPreloader = (preloader, siteContainer) => {
    let frameIndex = 0;
    const preloaderFrameCount = preloaderFrames.length;
    const preloaderInterval = setInterval(() => {
        if (preloader) {
            preloader.textContent = preloaderFrames[frameIndex];
            frameIndex++;
            if (frameIndex >= preloaderFrameCount - 1) {
                clearInterval(preloaderInterval);
                // Show only the last frame (the final text)
                preloader.textContent = preloaderFrames[preloaderFrameCount - 1];
            }
        }
    }, 80);

    setTimeout(() => {
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                preloader.style.display = 'none';
                preloader.textContent = '';
            }, 500);
        }
        document.body.style.overflow = 'auto'; // Restore scroll
        if(siteContainer) siteContainer.style.opacity = '1';
    }, 2500);
};
