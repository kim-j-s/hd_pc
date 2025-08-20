// vite.config.js
import { defineConfig } from "file:///C:/web/pc/node_modules/vite/dist/node/index.js";
import handlebars from "file:///C:/web/pc/node_modules/vite-plugin-handlebars/dist/index.js";
import autoprefixer from "file:///C:/web/pc/node_modules/autoprefixer/lib/autoprefixer.js";
import fs from "fs";
import path, { resolve } from "path";
import pxtorem from "file:///C:/web/pc/node_modules/postcss-pxtorem/index.js";
var __vite_injected_original_dirname = "C:\\web\\pc";
var partialPath = "src/_partials";
var helpers = {
  stripHtml: (text) => {
    if (typeof text !== "string") return text;
    return text.replace(/(<([^>]+)>)/gi, "");
  }
};
var getEntries = (dir) => {
  const htmlEntries = {};
  if (dir.length === dir.replace(partialPath, "").length && dir.length) {
    fs.readdirSync(dir).forEach((item) => {
      const itemPath = path.join(dir, item);
      if (fs.statSync(itemPath).isFile()) {
        if (path.extname(item) == ".html" || path.extname(item) == ".js" || path.extname(item) == ".css") {
          htmlEntries[itemPath] = resolve(__vite_injected_original_dirname, itemPath);
        }
      } else {
        Object.assign(htmlEntries, getEntries(itemPath));
      }
    });
  }
  return htmlEntries;
};
var getContexts = (dir) => {
  const contexts = {};
  fs.readdirSync(dir).forEach((item) => {
    const itemPath = path.join(dir, item);
    if (fs.statSync(itemPath).isFile()) {
      if (path.extname(item) == ".json") {
        contexts[itemPath.replace("src", "").replace("config.json", "html")] = JSON.parse(fs.readFileSync(itemPath));
      }
    } else {
      Object.assign(contexts, getContexts(itemPath));
    }
  });
  return contexts;
};
var pageData = getContexts("src");
var vite_config_default = defineConfig({
  // export default {
  root: "src",
  // base: '/',
  publicDir: "../public",
  // publicDir: path.resolve(__dirname, "src/web/pub/img"),
  build: {
    // outDir: '../dist',
    outDir: "../dist",
    assetsDir: "./",
    cssMinify: false,
    // cssMinify: true,
    overwrite: true,
    minify: false,
    terserOptions: {
      output: {
        comments: true
        // 주석을 보존하도록 설정
      }
    },
    rollupOptions: {
      minify: false,
      input: getEntries("src"),
      output: {
        assetFileNames: (entry) => {
          if (path.extname(entry.name) == ".css") {
            return entry.name.replace("src/", "");
          }
          return entry.name;
        },
        entryFileNames: (entry) => {
          if (path.extname(entry.name) == ".js") {
            return path.relative("src", entry.name);
          }
          return entry.name;
        }
      }
    }
  },
  plugins: [
    handlebars({
      // partialDirectory: resolve(__dirname, 'src/_partials'), //partials 경로 설정
      //partials 경로 설정
      partialDirectory: [
        // resolve(__dirname, 'src/_partials/common'),
        // resolve(__dirname, 'src/_partials/input'),
        // resolve(__dirname, 'src/_partials/contents'),
        resolve(__vite_injected_original_dirname, "src/_partials")
      ],
      context(pagePath) {
        return pageData[pagePath];
      },
      helpers
      // helpers 등록
    }),
    {
      name: "html-transform",
      // 플러그인 이름
      transformIndexHtml(html) {
        return html.replace(
          /crossorigin href="\/css\/reset\.css"/g,
          'href="../../../css/reset.css"'
        ).replace(
          /crossorigin href="\/css\/common\.css"/g,
          'href="../../../css/common.css"'
        ).replace(
          /crossorigin href="\/css\/contents\.css"/g,
          'href="../../../css/contents.css"'
        ).replace(
          /crossorigin href="\/css\/contents_pc\.css"/g,
          'href="../../../css/contents_pc.css"'
        ).replace(
          /crossorigin href="\/css\/popup\.css"/g,
          'href="../../../css/popup.css"'
        ).replace(
          /crossorigin href="\/css\/popup_pc\.css"/g,
          'href="../../../css/popup_pc.css"'
        ).replace(
          /crossorigin href="\/html\/guide\/guide\/guide\.css"/g,
          'href="guide.css"'
        );
      }
    },
    {
      name: "delete-svn-folder-recursively",
      closeBundle() {
        const deleteSVNFolderRecursively = (dir) => {
          if (!fs.existsSync(dir)) return;
          const files = fs.readdirSync(dir);
          files.forEach((file) => {
            const currentPath = path.join(dir, file);
            const stat = fs.statSync(currentPath);
            if (stat.isDirectory()) {
              if (file === ".svn") {
                fs.rmSync(currentPath, { recursive: true, force: true });
                console.log(`Deleted ${currentPath}`);
              } else {
                deleteSVNFolderRecursively(currentPath);
              }
            }
          });
        };
        const distPath = path.resolve(__vite_injected_original_dirname, "dist");
        deleteSVNFolderRecursively(distPath);
      }
    }
  ],
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        sourceMap: true
        // SCSS 파일에 대한 Sourcemap 생성 활성화
      }
    },
    postcss: {
      plugins: [
        // autoprefixer()
        autoprefixer({
          overrideBrowserslist: ["> 1%", "last 2 versions", "Firefox ESR"]
        })
        // pxtorem 플러그인 추가 (build 시에만 적용)
        // ...(process.env.NODE_ENV === 'production'
        //   ? [
        //       pxtorem({
        //         rootValue: 10, // 기준 root 폰트 크기
        //         propList: ['*'], // 변환할 속성 목록
        //         selectorBlackList: [], // 변환하지 않을 선택자 목록
        //         minPixelValue: 2, // 변환할 최소 픽셀 값
        //       }),
        //     ]
        //   : []), // 변경된 구간: build 시에만 pxtorem 적용
      ]
    }
  },
  server: {
    // host: 'localhost',
    host: "0.0.0.0",
    open: "index.html",
    port: 8012,
    hmr: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx3ZWJcXFxccGNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHdlYlxcXFxwY1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovd2ViL3BjL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBoYW5kbGViYXJzIGZyb20gJ3ZpdGUtcGx1Z2luLWhhbmRsZWJhcnMnO1xyXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcic7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuLy8gaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi9zcmMvX2hlbHBlcnMvaW5kZXgnO1xyXG5cclxuLy8gaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi9zcmMvX2hlbHBlcnMvaW5kZXgnO1xyXG5pbXBvcnQgcHh0b3JlbSBmcm9tICdwb3N0Y3NzLXB4dG9yZW0nOyAvLyBweHRvcmVtIFx1RDUwQ1x1QjdFQ1x1QURGOFx1Qzc3OCBcdUFDMDBcdUM4MzhcdUM2MjRcdUFFMzBcclxuXHJcbi8vIHNyYyBcdUIwQjQgXHVCRTRDXHVCNERDIFx1RDMwQ1x1Qzc3QyBcdUM1RDRcdUQyQjhcdUI5QUMoaHRtbCwganMsIGNzcykgXHVCOUNDXHVCNEU0XHVBRTMwXHJcblxyXG4vLyBjb25zdCBwYXJ0aWFsUGF0aCA9ICdzcmMvX3BhcnRpYWxzJzsgIC8vIHBhcnRpYWxzIFx1QUNCRFx1Qjg1Q1xyXG4vLyBjb25zdCBoZWxwZXJQYXRoID0gJ3NyYy9faGVscGVycyc7ICAvLyBoZWxwZXJzIFx1QUNCRFx1Qjg1QyAoXHVDNUQ0XHVEMkI4XHVCOUFDIFx1QzYwOFx1QzY3OFx1Q0M5OFx1QjlBQylcclxuXHJcbmNvbnN0IHBhcnRpYWxQYXRoID0gJ3NyYy9fcGFydGlhbHMnO1xyXG4vLyBjb25zdCBoZWxwZXJQYXRoID0gJ3NyYy9faGVscGVycyc7XHJcblxyXG5cclxuY29uc3QgaGVscGVycyA9IHtcclxuICBzdHJpcEh0bWw6ICh0ZXh0KSA9PiB7XHJcbiAgICBpZiAodHlwZW9mIHRleHQgIT09ICdzdHJpbmcnKSByZXR1cm4gdGV4dDtcclxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoLyg8KFtePl0rKT4pL2dpLCAnJyk7XHJcbiAgfSxcclxufTtcclxuXHJcbmNvbnN0IGdldEVudHJpZXMgPSBkaXIgPT4ge1xyXG4gIGNvbnN0IGh0bWxFbnRyaWVzID0ge307XHJcblxyXG4gIC8vIGlmKGRpci5sZW5ndGggPT09IGRpci5yZXBsYWNlKHBhcnRpYWxQYXRoLCAnJykubGVuZ3RoICYmIGRpci5sZW5ndGggPT09IGRpci5yZXBsYWNlKGhlbHBlclBhdGgsICcnKS5sZW5ndGggKSB7XHJcbiAgaWYoZGlyLmxlbmd0aCA9PT0gZGlyLnJlcGxhY2UocGFydGlhbFBhdGgsICcnKS5sZW5ndGggJiYgZGlyLmxlbmd0aCApIHtcclxuICAgIGZzLnJlYWRkaXJTeW5jKGRpcikuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgY29uc3QgaXRlbVBhdGggPSBwYXRoLmpvaW4oZGlyLCBpdGVtKTtcclxuICBcclxuICAgICAgaWYoZnMuc3RhdFN5bmMoaXRlbVBhdGgpLmlzRmlsZSgpKSB7XHJcbiAgICAgICAgaWYocGF0aC5leHRuYW1lKGl0ZW0pID09ICcuaHRtbCcgfHwgcGF0aC5leHRuYW1lKGl0ZW0pID09ICcuanMnIHx8IHBhdGguZXh0bmFtZShpdGVtKSA9PSAnLmNzcycpIHtcclxuICAgICAgICAgIGh0bWxFbnRyaWVzW2l0ZW1QYXRoXSA9IHJlc29sdmUoX19kaXJuYW1lLCBpdGVtUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oaHRtbEVudHJpZXMsIGdldEVudHJpZXMoaXRlbVBhdGgpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaHRtbEVudHJpZXM7XHJcbn07XHJcblxyXG5jb25zdCBnZXRDb250ZXh0cyA9IGRpciA9PiB7XHJcbiAgY29uc3QgY29udGV4dHMgPSB7fTtcclxuXHJcbiAgZnMucmVhZGRpclN5bmMoZGlyKS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgY29uc3QgaXRlbVBhdGggPSBwYXRoLmpvaW4oZGlyLCBpdGVtKTtcclxuXHJcbiAgICBpZihmcy5zdGF0U3luYyhpdGVtUGF0aCkuaXNGaWxlKCkpIHtcclxuICAgICAgaWYocGF0aC5leHRuYW1lKGl0ZW0pID09ICcuanNvbicpIHtcclxuICAgICAgICBjb250ZXh0c1tpdGVtUGF0aC5yZXBsYWNlKCdzcmMnLCcnKS5yZXBsYWNlKCdjb25maWcuanNvbicsICdodG1sJyldID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoaXRlbVBhdGgpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgT2JqZWN0LmFzc2lnbihjb250ZXh0cywgZ2V0Q29udGV4dHMoaXRlbVBhdGgpKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGNvbnRleHRzO1xyXG59XHJcblxyXG5jb25zdCBwYWdlRGF0YSA9IGdldENvbnRleHRzKCdzcmMnKTtcclxuLy8gY29uc29sZS5sb2coZ2V0RW50cmllcygnc3JjJykpO1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4vLyBleHBvcnQgZGVmYXVsdCB7XHJcbiAgcm9vdDogJ3NyYycsXHJcbiAgLy8gYmFzZTogJy8nLFxyXG4gIHB1YmxpY0RpcjogJy4uL3B1YmxpYycsXHJcbiAgLy8gcHVibGljRGlyOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy93ZWIvcHViL2ltZ1wiKSxcclxuICBidWlsZDoge1xyXG4gICAgLy8gb3V0RGlyOiAnLi4vZGlzdCcsXHJcbiAgICBvdXREaXI6ICcuLi9kaXN0JyxcclxuICAgIGFzc2V0c0RpcjogJy4vJyxcclxuICAgIGNzc01pbmlmeTogZmFsc2UsXHJcbiAgICAvLyBjc3NNaW5pZnk6IHRydWUsXHJcbiAgICBvdmVyd3JpdGU6IHRydWUsXHJcblx0XHRtaW5pZnk6IGZhbHNlLFxyXG5cdFx0dGVyc2VyT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBjb21tZW50czogdHJ1ZSwgLy8gXHVDOEZDXHVDMTFEXHVDNzQ0IFx1QkNGNFx1Qzg3NFx1RDU1OFx1QjNDNFx1Qjg1RCBcdUMxMjRcdUM4MTVcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG1pbmlmeTogZmFsc2UsXHJcbiAgICAgIGlucHV0OiBnZXRFbnRyaWVzKCdzcmMnKSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChlbnRyeSkgPT4ge1xyXG4gICAgICAgICAgaWYocGF0aC5leHRuYW1lKGVudHJ5Lm5hbWUpID09ICcuY3NzJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZW50cnkubmFtZS5yZXBsYWNlKCdzcmMvJywgJycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGVudHJ5Lm5hbWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogKGVudHJ5KSA9PiB7XHJcbiAgICAgICAgICBpZihwYXRoLmV4dG5hbWUoZW50cnkubmFtZSkgPT0gJy5qcycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUoXCJzcmNcIiwgZW50cnkubmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gZW50cnkubmFtZTtcclxuICAgICAgICB9LFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICBoYW5kbGViYXJzKHtcclxuICAgICAgLy8gcGFydGlhbERpcmVjdG9yeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvX3BhcnRpYWxzJyksIC8vcGFydGlhbHMgXHVBQ0JEXHVCODVDIFx1QzEyNFx1QzgxNVxyXG4gICAgICAvL3BhcnRpYWxzIFx1QUNCRFx1Qjg1QyBcdUMxMjRcdUM4MTVcclxuICAgICAgcGFydGlhbERpcmVjdG9yeTogW1xyXG4gICAgICAgIC8vIHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL19wYXJ0aWFscy9jb21tb24nKSxcclxuICAgICAgICAvLyByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9fcGFydGlhbHMvaW5wdXQnKSxcclxuICAgICAgICAvLyByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9fcGFydGlhbHMvY29udGVudHMnKSxcclxuICAgICAgICByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9fcGFydGlhbHMnKSxcclxuICAgICAgXSxcclxuICAgICAgY29udGV4dChwYWdlUGF0aCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0ZXN0Mi0tLScpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBhZ2VEYXRhKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhwYWdlUGF0aCk7XHJcbiAgICAgICAgcmV0dXJuIHBhZ2VEYXRhW3BhZ2VQYXRoXTtcclxuICAgICAgfSxcclxuICAgICAgaGVscGVycywgLy8gaGVscGVycyBcdUI0RjFcdUI4NURcclxuICAgIH0pLFxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnaHRtbC10cmFuc2Zvcm0nLCAvLyBcdUQ1MENcdUI3RUNcdUFERjhcdUM3NzggXHVDNzc0XHVCOTg0XHJcbiAgICAgIHRyYW5zZm9ybUluZGV4SHRtbChodG1sKSB7XHJcbiAgICAgICAgLy8gXHVDNUVDXHVCN0VDIFx1QjlDMVx1RDA2QyBcdUQwRENcdUFERjhcdUM3NTggaHJlZiBcdUMxOERcdUMxMzEgXHVCQ0MwXHVBQ0JEXHJcbiAgICAgICAgICByZXR1cm4gaHRtbFxyXG4gICAgICAgICAgLnJlcGxhY2UoXHJcbiAgICAgICAgICAgIC9jcm9zc29yaWdpbiBocmVmPVwiXFwvY3NzXFwvcmVzZXRcXC5jc3NcIi9nLFxyXG4gICAgICAgICAgICAnaHJlZj1cIi4uLy4uLy4uL2Nzcy9yZXNldC5jc3NcIidcclxuICAgICAgICAgIClcclxuICAgICAgICAgIC5yZXBsYWNlKFxyXG4gICAgICAgICAgICAvY3Jvc3NvcmlnaW4gaHJlZj1cIlxcL2Nzc1xcL2NvbW1vblxcLmNzc1wiL2csXHJcbiAgICAgICAgICAgICdocmVmPVwiLi4vLi4vLi4vY3NzL2NvbW1vbi5jc3NcIidcclxuICAgICAgICAgIClcclxuICAgICAgICAgIC5yZXBsYWNlKFxyXG4gICAgICAgICAgICAvY3Jvc3NvcmlnaW4gaHJlZj1cIlxcL2Nzc1xcL2NvbnRlbnRzXFwuY3NzXCIvZyxcclxuICAgICAgICAgICAgJ2hyZWY9XCIuLi8uLi8uLi9jc3MvY29udGVudHMuY3NzXCInXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAucmVwbGFjZShcclxuICAgICAgICAgICAgL2Nyb3Nzb3JpZ2luIGhyZWY9XCJcXC9jc3NcXC9jb250ZW50c19wY1xcLmNzc1wiL2csXHJcbiAgICAgICAgICAgICdocmVmPVwiLi4vLi4vLi4vY3NzL2NvbnRlbnRzX3BjLmNzc1wiJ1xyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgLnJlcGxhY2UoXHJcbiAgICAgICAgICAgIC9jcm9zc29yaWdpbiBocmVmPVwiXFwvY3NzXFwvcG9wdXBcXC5jc3NcIi9nLFxyXG4gICAgICAgICAgICAnaHJlZj1cIi4uLy4uLy4uL2Nzcy9wb3B1cC5jc3NcIidcclxuICAgICAgICAgIClcclxuICAgICAgICAgIC5yZXBsYWNlKFxyXG4gICAgICAgICAgICAvY3Jvc3NvcmlnaW4gaHJlZj1cIlxcL2Nzc1xcL3BvcHVwX3BjXFwuY3NzXCIvZyxcclxuICAgICAgICAgICAgJ2hyZWY9XCIuLi8uLi8uLi9jc3MvcG9wdXBfcGMuY3NzXCInXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAucmVwbGFjZShcclxuICAgICAgICAgICAgL2Nyb3Nzb3JpZ2luIGhyZWY9XCJcXC9odG1sXFwvZ3VpZGVcXC9ndWlkZVxcL2d1aWRlXFwuY3NzXCIvZyxcclxuICAgICAgICAgICAgJ2hyZWY9XCJndWlkZS5jc3NcIidcclxuICAgICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblx0XHR7XHJcbiAgICAgIG5hbWU6ICdkZWxldGUtc3ZuLWZvbGRlci1yZWN1cnNpdmVseScsXHJcbiAgICAgIGNsb3NlQnVuZGxlKCkge1xyXG4gICAgICAgIGNvbnN0IGRlbGV0ZVNWTkZvbGRlclJlY3Vyc2l2ZWx5ID0gKGRpcikgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKCFmcy5leGlzdHNTeW5jKGRpcikpIHJldHVybjtcclxuXHRcdFx0XHRcdFxyXG4gICAgICAgICAgY29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhkaXIpO1xyXG4gICAgICAgICAgZmlsZXMuZm9yRWFjaChmaWxlID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFBhdGggPSBwYXRoLmpvaW4oZGlyLCBmaWxlKTtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdCA9IGZzLnN0YXRTeW5jKGN1cnJlbnRQYXRoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGF0LmlzRGlyZWN0b3J5KCkpIHtcclxuICAgICAgICAgICAgICBpZiAoZmlsZSA9PT0gJy5zdm4nKSB7XHJcbiAgICAgICAgICAgICAgICBmcy5ybVN5bmMoY3VycmVudFBhdGgsIHsgcmVjdXJzaXZlOiB0cnVlLCBmb3JjZTogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBEZWxldGVkICR7Y3VycmVudFBhdGh9YCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZVNWTkZvbGRlclJlY3Vyc2l2ZWx5KGN1cnJlbnRQYXRoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vICdkaXN0JyBcdUI1MTRcdUI4MDlcdUQxQTBcdUI5QUMgXHVCMEI0IFx1QkFBOFx1QjRFMCBcdUMxMUNcdUJFMENcdUI1MTRcdUI4MDlcdUQxQTBcdUI5QUNcdUI5N0MgXHVEMEQwXHVDMEM5XHVENTU4XHVDNUVDIC5zdm4gXHVEM0Y0XHVCMzU0IFx1QzBBRFx1QzgxQ1xyXG5cdFx0XHRcdGNvbnN0IGRpc3RQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QnKTtcclxuXHRcdFx0XHRkZWxldGVTVk5Gb2xkZXJSZWN1cnNpdmVseShkaXN0UGF0aCk7XHJcbiAgICAgICAgLy8gZGVsZXRlU1ZORm9sZGVyUmVjdXJzaXZlbHkocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QnKSk7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbiAgY3NzOiB7XHJcbiAgICBkZXZTb3VyY2VtYXA6IHRydWUsXHJcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgIHNjc3M6IHtcclxuICAgICAgICBzb3VyY2VNYXA6IHRydWUsIC8vIFNDU1MgXHVEMzBDXHVDNzdDXHVDNUQwIFx1QjMwMFx1RDU1QyBTb3VyY2VtYXAgXHVDMEREXHVDMTMxIFx1RDY1Q1x1QzEzMVx1RDY1NFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBvc3Rjc3M6IHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIC8vIGF1dG9wcmVmaXhlcigpXHJcbiAgICAgICAgYXV0b3ByZWZpeGVyKHtcclxuICAgICAgICAgIG92ZXJyaWRlQnJvd3NlcnNsaXN0OiBbJz4gMSUnLCAnbGFzdCAyIHZlcnNpb25zJywgJ0ZpcmVmb3ggRVNSJ10sXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgLy8gcHh0b3JlbSBcdUQ1MENcdUI3RUNcdUFERjhcdUM3NzggXHVDRDk0XHVBQzAwIChidWlsZCBcdUMyRENcdUM1RDBcdUI5Q0MgXHVDODAxXHVDNkE5KVxyXG4gICAgICAgIC8vIC4uLihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nXHJcbiAgICAgICAgLy8gICA/IFtcclxuICAgICAgICAvLyAgICAgICBweHRvcmVtKHtcclxuICAgICAgICAvLyAgICAgICAgIHJvb3RWYWx1ZTogMTAsIC8vIFx1QUUzMFx1QzkwMCByb290IFx1RDNGMFx1RDJCOCBcdUQwNkNcdUFFMzBcclxuICAgICAgICAvLyAgICAgICAgIHByb3BMaXN0OiBbJyonXSwgLy8gXHVCQ0MwXHVENjU4XHVENTYwIFx1QzE4RFx1QzEzMSBcdUJBQTlcdUI4NURcclxuICAgICAgICAvLyAgICAgICAgIHNlbGVjdG9yQmxhY2tMaXN0OiBbXSwgLy8gXHVCQ0MwXHVENjU4XHVENTU4XHVDOUMwIFx1QzU0QVx1Qzc0NCBcdUMxMjBcdUQwRERcdUM3OTAgXHVCQUE5XHVCODVEXHJcbiAgICAgICAgLy8gICAgICAgICBtaW5QaXhlbFZhbHVlOiAyLCAvLyBcdUJDQzBcdUQ2NThcdUQ1NjAgXHVDRDVDXHVDMThDIFx1RDUzRFx1QzE0MCBcdUFDMTJcclxuICAgICAgICAvLyAgICAgICB9KSxcclxuICAgICAgICAvLyAgICAgXVxyXG4gICAgICAgIC8vICAgOiBbXSksIC8vIFx1QkNDMFx1QUNCRFx1QjQxQyBcdUFENkNcdUFDMDQ6IGJ1aWxkIFx1QzJEQ1x1QzVEMFx1QjlDQyBweHRvcmVtIFx1QzgwMVx1QzZBOVxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgLy8gaG9zdDogJ2xvY2FsaG9zdCcsXHJcbiAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICBvcGVuOiAnaW5kZXguaHRtbCcsXHJcbiAgICBwb3J0OiA4MDEyLFxyXG5cdFx0aG1yOiB0cnVlLFxyXG4gIH1cclxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFtTixTQUFTLG9CQUFvQjtBQUNoUCxPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGtCQUFrQjtBQUN6QixPQUFPLFFBQVE7QUFDZixPQUFPLFFBQVEsZUFBZTtBQUk5QixPQUFPLGFBQWE7QUFScEIsSUFBTSxtQ0FBbUM7QUFlekMsSUFBTSxjQUFjO0FBSXBCLElBQU0sVUFBVTtBQUFBLEVBQ2QsV0FBVyxDQUFDLFNBQVM7QUFDbkIsUUFBSSxPQUFPLFNBQVMsU0FBVSxRQUFPO0FBQ3JDLFdBQU8sS0FBSyxRQUFRLGlCQUFpQixFQUFFO0FBQUEsRUFDekM7QUFDRjtBQUVBLElBQU0sYUFBYSxTQUFPO0FBQ3hCLFFBQU0sY0FBYyxDQUFDO0FBR3JCLE1BQUcsSUFBSSxXQUFXLElBQUksUUFBUSxhQUFhLEVBQUUsRUFBRSxVQUFVLElBQUksUUFBUztBQUNwRSxPQUFHLFlBQVksR0FBRyxFQUFFLFFBQVEsVUFBUTtBQUNsQyxZQUFNLFdBQVcsS0FBSyxLQUFLLEtBQUssSUFBSTtBQUVwQyxVQUFHLEdBQUcsU0FBUyxRQUFRLEVBQUUsT0FBTyxHQUFHO0FBQ2pDLFlBQUcsS0FBSyxRQUFRLElBQUksS0FBSyxXQUFXLEtBQUssUUFBUSxJQUFJLEtBQUssU0FBUyxLQUFLLFFBQVEsSUFBSSxLQUFLLFFBQVE7QUFDL0Ysc0JBQVksUUFBUSxJQUFJLFFBQVEsa0NBQVcsUUFBUTtBQUFBLFFBQ3JEO0FBQUEsTUFDRixPQUFPO0FBQ0wsZUFBTyxPQUFPLGFBQWEsV0FBVyxRQUFRLENBQUM7QUFBQSxNQUNqRDtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFFQSxTQUFPO0FBQ1Q7QUFFQSxJQUFNLGNBQWMsU0FBTztBQUN6QixRQUFNLFdBQVcsQ0FBQztBQUVsQixLQUFHLFlBQVksR0FBRyxFQUFFLFFBQVEsVUFBUTtBQUNsQyxVQUFNLFdBQVcsS0FBSyxLQUFLLEtBQUssSUFBSTtBQUVwQyxRQUFHLEdBQUcsU0FBUyxRQUFRLEVBQUUsT0FBTyxHQUFHO0FBQ2pDLFVBQUcsS0FBSyxRQUFRLElBQUksS0FBSyxTQUFTO0FBQ2hDLGlCQUFTLFNBQVMsUUFBUSxPQUFNLEVBQUUsRUFBRSxRQUFRLGVBQWUsTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLEdBQUcsYUFBYSxRQUFRLENBQUM7QUFBQSxNQUM1RztBQUFBLElBQ0YsT0FBTztBQUNMLGFBQU8sT0FBTyxVQUFVLFlBQVksUUFBUSxDQUFDO0FBQUEsSUFDL0M7QUFBQSxFQUNGLENBQUM7QUFFRCxTQUFPO0FBQ1Q7QUFFQSxJQUFNLFdBQVcsWUFBWSxLQUFLO0FBRWxDLElBQU8sc0JBQVEsYUFBYTtBQUFBO0FBQUEsRUFFMUIsTUFBTTtBQUFBO0FBQUEsRUFFTixXQUFXO0FBQUE7QUFBQSxFQUVYLE9BQU87QUFBQTtBQUFBLElBRUwsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBO0FBQUEsSUFFWCxXQUFXO0FBQUEsSUFDYixRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDWCxRQUFRO0FBQUEsUUFDTixVQUFVO0FBQUE7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLE1BQ1IsT0FBTyxXQUFXLEtBQUs7QUFBQSxNQUN2QixRQUFRO0FBQUEsUUFDTixnQkFBZ0IsQ0FBQyxVQUFVO0FBQ3pCLGNBQUcsS0FBSyxRQUFRLE1BQU0sSUFBSSxLQUFLLFFBQVE7QUFDckMsbUJBQU8sTUFBTSxLQUFLLFFBQVEsUUFBUSxFQUFFO0FBQUEsVUFDdEM7QUFDQSxpQkFBTyxNQUFNO0FBQUEsUUFDZjtBQUFBLFFBQ0EsZ0JBQWdCLENBQUMsVUFBVTtBQUN6QixjQUFHLEtBQUssUUFBUSxNQUFNLElBQUksS0FBSyxPQUFPO0FBQ3BDLG1CQUFPLEtBQUssU0FBUyxPQUFPLE1BQU0sSUFBSTtBQUFBLFVBQ3hDO0FBQ0EsaUJBQU8sTUFBTTtBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFdBQVc7QUFBQTtBQUFBO0FBQUEsTUFHVCxrQkFBa0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUloQixRQUFRLGtDQUFXLGVBQWU7QUFBQSxNQUNwQztBQUFBLE1BQ0EsUUFBUSxVQUFVO0FBSWhCLGVBQU8sU0FBUyxRQUFRO0FBQUEsTUFDMUI7QUFBQSxNQUNBO0FBQUE7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNEO0FBQUEsTUFDRSxNQUFNO0FBQUE7QUFBQSxNQUNOLG1CQUFtQixNQUFNO0FBRXJCLGVBQU8sS0FDTjtBQUFBLFVBQ0M7QUFBQSxVQUNBO0FBQUEsUUFDRixFQUNDO0FBQUEsVUFDQztBQUFBLFVBQ0E7QUFBQSxRQUNGLEVBQ0M7QUFBQSxVQUNDO0FBQUEsVUFDQTtBQUFBLFFBQ0YsRUFDQztBQUFBLFVBQ0M7QUFBQSxVQUNBO0FBQUEsUUFDRixFQUNDO0FBQUEsVUFDQztBQUFBLFVBQ0E7QUFBQSxRQUNGLEVBQ0M7QUFBQSxVQUNDO0FBQUEsVUFDQTtBQUFBLFFBQ0YsRUFDQztBQUFBLFVBQ0M7QUFBQSxVQUNBO0FBQUEsUUFDRjtBQUFBLE1BQ0o7QUFBQSxJQUNGO0FBQUEsSUFDRjtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sY0FBYztBQUNaLGNBQU0sNkJBQTZCLENBQUMsUUFBUTtBQUMvQyxjQUFJLENBQUMsR0FBRyxXQUFXLEdBQUcsRUFBRztBQUVwQixnQkFBTSxRQUFRLEdBQUcsWUFBWSxHQUFHO0FBQ2hDLGdCQUFNLFFBQVEsVUFBUTtBQUNwQixrQkFBTSxjQUFjLEtBQUssS0FBSyxLQUFLLElBQUk7QUFDdkMsa0JBQU0sT0FBTyxHQUFHLFNBQVMsV0FBVztBQUVwQyxnQkFBSSxLQUFLLFlBQVksR0FBRztBQUN0QixrQkFBSSxTQUFTLFFBQVE7QUFDbkIsbUJBQUcsT0FBTyxhQUFhLEVBQUUsV0FBVyxNQUFNLE9BQU8sS0FBSyxDQUFDO0FBQ3ZELHdCQUFRLElBQUksV0FBVyxXQUFXLEVBQUU7QUFBQSxjQUN0QyxPQUFPO0FBQ0wsMkNBQTJCLFdBQVc7QUFBQSxjQUN4QztBQUFBLFlBQ0Y7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBR0osY0FBTSxXQUFXLEtBQUssUUFBUSxrQ0FBVyxNQUFNO0FBQy9DLG1DQUEyQixRQUFRO0FBQUEsTUFFakM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gsY0FBYztBQUFBLElBQ2QscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBLFFBQ0osV0FBVztBQUFBO0FBQUEsTUFDYjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQTtBQUFBLFFBRVAsYUFBYTtBQUFBLFVBQ1gsc0JBQXNCLENBQUMsUUFBUSxtQkFBbUIsYUFBYTtBQUFBLFFBQ2pFLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFZSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFBQSxJQUVOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNSLEtBQUs7QUFBQSxFQUNMO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
