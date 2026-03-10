/*
 * @Description:
 * @Version: 2.0
 * @Autor: whaoo
 * @Date: 2023-12-11 09:40:40
 * @LastEditors: whaoo
 * @LastEditTime: 2023-12-11 10:28:07
 */
export default `* {
    box-sizing: border-box;
}
@media print {
    @page {
      margin: 0mm; /* 设置页边距为10毫米 */
    }
#topHeight{
height: 46px !important;
}
    table{
    page-break-inside: auto !important;
     break-inside: auto !important;
    }
#print_container {
    width:1140px;
    padding: 64px 50px 0px;
    padding-top: 0px !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color-adjust: exact;
}

.print-content {
    page-break-inside: auto;
    break-inside: auto;
}
  


.print_title {
 padding-top:65px;
    font-size: 46px;
    font-weight: bold;
    text-align: center;
    color: #323232;
    margin-bottom: 46px;
}

#print_container td { 
    border-right: 1px solid #323232;
    border-bottom: 1px solid #323232;
    padding-left: 30px;
}

#print_container table {
 border-collapse: collapse; 
    border-left: 1px solid #323232;
    border-top: 1px solid #323232;
    width: 100%;
    font-size: 32px;
    color: #323232;
}


table, th, td {
    border: 1px solid #000000 !important; /* 确保表格边框在打印时显示 */
}

.table_padding{
    padding: 30px 0;
}

#print_container tr {
    height: 68px;
}

.table_bg {
    background-color: #EEEEEE;
}

.part_title {
    color: #323232;
    font-size: 32px;
    font-weight: bold;
    margin-top: 46px;
    margin-bottom: 10px;
}

.part_text {
    color: #323232;
    font-size: 32px;
}
.print_page {
    page-break-after: always !important;
    break-after: page !important;
    page-break-inside: avoid !important; /* 避免在元素内部分页 */
    clear: both !important; /* 清除浮动 */
    display: block !important; /* 确保是块级元素 */
}
     .print_page + .print_page {
        page-break-before: always !important;
        break-before: page !important;
    }

    }  
 
`
