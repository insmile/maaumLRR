# lrp.maaum.client

## 테이블 전환

```javascript
<script type="text/javascript">
    $(function() {
        jQuery.each($("table tr"), function() { 
            $(this).children(":eq(1)").after($(this).children(":eq(0)"));
        });
    });
</script>
```