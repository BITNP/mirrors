package main

import (
    "fmt"
    "net/http"
    "strings"
		"log"
    "os"
		"io/ioutil"
    "path/filepath"
		"strconv"
		"encoding/json"
)

type Mirror struct {
	Name string `json:"name"`
	Type   string `json:"type"`
	Size   string `json:"size"`
	LastUpdate   string `json:"last_update"`
}

type Mirrorslice struct {
	Mirrors []Mirror `json:"mirrors"`
	PageSize int `json:"pageSize"`
	PageNum int `json:"pageNum"`
	RealNum int `json:"realNum"`
	Total int `json:"total"`
}

func sayhelloName(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		//"*"表示接受任意域名的请求，这个值也可以根据自己需要，设置成不同域名
    r.ParseForm()  //解析参数，默认是不会解析的
    fmt.Println(r.Form)  //这些信息是输出到服务器端的打印信息
    fmt.Println("path", r.URL.Path)
    fmt.Println("scheme", r.URL.Scheme)
		fmt.Println(r.Form["url_long"])
		fmt.Println()
    for k, v := range r.Form {
        fmt.Println("key:", k)
        fmt.Println("val:", strings.Join(v, ""))
		}
		if len(r.Form["pageSize"]) > 0 {
			fmt.Println(r.Form["pageSize"][0])
		}
		// m, _ := ListDir("D:\\mirror" + r.URL.Path, ".txt")
		m, _ := ListDir("/home/ubuntu/mirrors_front_end/mirror" + r.URL.Path, ".txt")
		b, _ := json.Marshal(m)
    fmt.Fprintf(w, string(b)) // 这个写入到w的是输出到客户端的
}

func file() {
	filepath.Walk("./",
	func(path string, f os.FileInfo, err error) error {
			if f == nil {
					return err
			}
			if f.IsDir() {
					fmt.Println("dir:", path)
					return nil
			}
			fmt.Println("file:", path)
			return nil
	})
}

//获取指定目录下的所有文件，不进入下一级目录搜索，可以匹配后缀过滤。
// func ListDir(dirPth string, suffix string) (files []string, err error) {
func ListDir(dirPth string, suffix string) (m Mirrorslice, err error) {
	// files = make([]string, 0, 10)

	dir, err := ioutil.ReadDir(dirPth)
	if err != nil {
		var m_tmp Mirrorslice
		return m_tmp, err
	}
 
	// PthSep := string(os.PathSeparator)
	suffix = strings.ToUpper(suffix) //忽略后缀匹配的大小写
	
	// var s Serverslice
	// s.Servers = append(s.Servers, Server{ServerName: "Shanghai_VPN", ServerIP: "127.0.0.1"})
	// s.Servers = append(s.Servers, Server{ServerName: "Beijing_VPN", ServerIP: "127.0.0.2"})
	// b, err := json.Marshal(s)
	// if err != nil {
	// 		fmt.Println("json err:", err)
	// }
	// fmt.Println(string(b))
	// var m Mirrorslice
	// 获取目录下总镜像数，含目录
	m.Total = len(dir)
	for _, fi := range dir {
		if fi.IsDir() {
			m.Mirrors = append(m.Mirrors, Mirror{
				Name: fi.Name(),
				Type: "directory",
				Size: strconv.FormatInt(fi.Size(), 10),
				LastUpdate: strconv.FormatInt(fi.ModTime().Unix(), 10)})
		} else {
			m.Mirrors = append(m.Mirrors, Mirror{
				Name: fi.Name(),
				Type: "file",
				Size: strconv.FormatInt(fi.Size(), 10),
				LastUpdate: strconv.FormatInt(fi.ModTime().Unix(), 10)})
		}


	// 	// files = append(files, dirPth+PthSep+fi.Name())
	// 	files = append(files, fi.Name())
	// 	if fi.IsDir() { // 忽略目录
	// 		files = append(files, "directory")
	// 	} else {
	// 		files = append(files, "file")
	// 	}
	// 	files = append(files, strconv.FormatInt(fi.Size(), 10))
	// 	files = append(files, strconv.FormatInt(fi.ModTime().Unix(), 10))
	// 	// files = append(files, strconv.FormatInt(reflect.ValueOf(fi.Sys()).Elem().FieldByName("Mtim").Field(0).Int(), 10))
	// 	// files = append(files, strconv.FormatInt(fi.Sys().(*syscall.Win32FileAttributeData).LastWriteTime.Nanoseconds(), 10))
	// //  if strings.HasSuffix(strings.ToUpper(fi.Name()), suffix) { //匹配文件
	// //  }
	}
	// 当页实际数目
	m.RealNum = len(m.Mirrors)
	return m, nil
 }

func main() {
    http.HandleFunc("/", sayhelloName) //设置访问的路由
		err := http.ListenAndServe(":9090", nil) //设置监听的端口
		// file()
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}