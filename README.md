# 과제내용

## 개요

해당 프로젝트는 샤샵의 상품정보 수집기술 중 일부를 분리한 프로젝트입니다.
NodeJS 및 Selenium, worker_threads에 대한 이해를 필요로 합니다.
해당 프로젝트의 코드를 controller 부터 내부로 분석하여 nodeJS에 대한 이해도를 높이길 바랍니다.

## 설치

해당 프로젝트 clone 후 모듈을 설치합니다.

```
npm install
```

## WORK-TODO 1 프로젝트셋팅

Selenium 동작을 위한 웹드라이버 셋팅이 필요합니다.
해당 프로젝트에는 윈도우 기준 chrome108버전을 이용하는 PC 기준으로 셋팅되어 있습니다.
본인이 사용하는 PC에 맞게 Selenium 설정을 변경 혹은 다른 웹드라이버를 셋팅하세요.

## -TODO 2 수집결과저장

원본 프로젝트는 상품정보 수집의 결과를 DB에 저장합니다.
해당 프로젝트에는 DB 연결 없이 수집의 결과를 JSON으로 리턴하고 있습니다.
수집결과의 저장에 대한 적절한 경로를 설계하여 JSON 파일로 저장하세요.

## WORK-TODO 3 사이트분석구현

해당 프로젝트에 구현된 분석은 SMARTSTORE만 가능합니다.

- https://smartstore.naver.com/jay_fit/products/6846515953
- https://smartstore.naver.com/azh/products/6395276402
- https://smartstore.naver.com/_needin_/products/5799491784

사이트 분석에 사용되는 Analysis와 코드의 동작을 이해하고 새로운 Analysis 및 수집코드를 추가하세요.

- 무신사 : https://www.musinsa.com/app/goods/2961081?loc=goods_rank
- 에이블리 : https://a-bly.com/app/goods/3315148

### 기타

과제 내용과 연관된 코드라인에 WORK-TODO 주석을 추가했습니다. 참고하여 작업하세요.

##### 동작 테스트 URL

```
http://localhost:4001/api/crawl/item?shopId=1&userId=1&shopUploadId=1&crawlSource=smartstore&crawlSourceUrl=https://smartstore.naver.com/jay_fit/products/7740758208
```
