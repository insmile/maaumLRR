# custom04

- replay 정보 저장 코드

```js
$scope.resultSchema.tasks[$scope.lrpModel.taskPivot].formJson = JSON.stringify({ custom04list, custom04positives, custom04response });
```

- replay 정보 저장 스키마

custom04positives : 선택 필요 문항 번호
custom04lists : 문항 리스트
custom04response : 문제 별 참여자 선택 응답 번호


# custom08

- replay 정보 저장 코드

```js
$scope.resultSchema.tasks[$scope.lrpModel.taskPivot].formJson = JSON.stringify({ custom08positives, custom08response });
```

- replay 정보 저장 스키마

custom08positives : 문제 별 정답 유형, true : 선택, false : 비선택
custom08response : 문제 별 참여자 선택 응답, true : 선택, false : 비선택

# custom30

- replay 기능 없음

# custom34

- replay 기능 없음

# custom35

- replay 정보 저장 코드

```js
$scope.resultSchema.tasks[$scope.lrpModel.taskPivot].formJson = JSON.stringify({ custom35scenario, custom35response });
```

- replay 정보 저장 스키마

custom35scenario : 랜덤 생성 문제 array. entity는 array로 문제 idx 쌍을 담고 있다. 같으면 same, 다르면 diff 문제
custom35response : 참여자가 선택한 응답. true는 same, false는 diff