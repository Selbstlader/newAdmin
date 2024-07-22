<template>
  <div v-if="columns.length" class="card table-search">
    <el-form ref="formRef" :model="searchParam">
      <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">
        <GridItem v-for="(item, index) in columns" :key="item.field" v-bind="getResponsive(item)" :index="index" class="z_header_input">
          <div v-if="item.searchType == 'input' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-input style="width: 232.36px;" @keyup.enter="topSearch(false)" v-model="searchs[item!.field!].value" :id="props.tableID + item.field" :placeholder="item.placeholder || '请输入'"/>
                        </div>
                        <div v-else-if="item.searchType == 'checkbox' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-select multiple collapse-tags v-model="searchs[item!.field!].checkbox" style="width: 232.36px;" :id="props.tableID + item.field"
                                clearable  :placeholder="item.placeholder || '请选择'" min="0" @change="(e: any) => bindChangeSelect(e, item.field)">
                                <el-option v-for="(itemOptions, indexOptions) in item.options" :key="indexOptions"
                                    :label="itemOptions.name" :value="itemOptions.name"/>
                            </el-select>
                        </div>
                        <div v-else-if="item.searchType == 'select' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-select collapse-tags v-model="searchs[item!.field!].value" style="width: 232.36px" :id="props.tableID + item.field"
                                clearable  :placeholder="item.placeholder || '请选择'" min="0" @change="(e: any) => bindChangeSelect(e, item.field)">
                                <el-option v-for="(itemOptions, indexOptions) in item.options" :key="indexOptions"
                                    :label="itemOptions.name" :value="itemOptions.name"/>
                            </el-select>
                        </div>
                        <div v-else-if="item.searchType == 'date' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-date-picker @change="setSearch(item, true)" style="width: 300px" :id="props.tableID + item.field"
                                v-model="searchs[item!.field!].elTime" type="daterange" value-format="YYYY-MM-DD"
                                range-separator="至" start-placeholder="开始日期" end-placeholder="截止日期" size="default" />
                        </div>
                        <div v-else-if="item.searchType == 'datetime' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-date-picker @change="setSearch(item, true)" style="width: 300px"
                                v-model="searchs[item!.field!].elTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime" :id="props.tableID + item.field"
                                range-separator="至" start-placeholder="开始时间" end-placeholder="截止时间" size="default" />
                        </div>
                        <div v-else-if="item.searchType == 'month' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-date-picker @change="setSearch(item, true)" style="width: 300px" :id="props.tableID + item.field"
                                v-model="searchs[item!.field!].elTime" type="monthrange" value-format="YYYY-MM"
                                range-separator="至" start-placeholder="开始日期" end-placeholder="截止日期" size="default" />
                        </div>
                        <div v-else-if="item.searchType == 'year' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-date-picker @change="setSearch(item, true)" style="width: 300px" :id="props.tableID + item.field"
                                v-model="searchs[item!.field!].value" type="year" value-format="YYYY" size="default" placeholder="请选择"  />
                        </div>
                        <div v-else-if="item.searchType == 'monthOne' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-date-picker @change="setSearch(item, true)" style="width: 300px" :id="props.tableID + item.field"
                                v-model="searchs[item!.field!].value" type="month" value-format="YYYY-MM" size="default" placeholder="请选择" />
                        </div>
                        <div v-else-if="item.searchType == 'range' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-input style="width: 93px;" @keyup.enter="topSearch(false)" :id="props.tableID + item.field"
                                v-model="searchs[item!.field!].minNumber"  :placeholder="item.placeholder || '请输入'"/>
                            <div class="center_content" @click="setMaxNumber(item)">至</div>
                            <el-input style="width: 93px;" @keyup.enter="topSearch(false)" :id="props.tableID + item.field"
                                v-model="searchs[item!.field!].maxNumber"  :placeholder="item.placeholder || '请输入'"/>
                        </div>
        </GridItem>
       
      </Grid>
    </el-form>
  </div>
</template>
<script setup lang="ts" name="SearchForm">
import { computed, ref } from "vue";
import { ColumnProps } from "/@/components/ProTable/interface";
import { BreakPoint } from "/@/components/Grid/interface";
// import SearchFormItem from "./components/SearchFormItem.vue";
import Grid from "/@/components/Grid/index.vue";
import GridItem from "/@/components/Grid/components/GridItem.vue";

interface ProTableProps {
  columns?: ColumnProps[]; // 搜索配置列
  searchParam?: { [key: string]: any }; // 搜索参数
  searchCol: number | Record<BreakPoint, number>;
  search: (params: any) => void; // 搜索方法
  reset: (params: any) => void; // 重置方法
}

// header搜索信息
const showTopSearch = ref(false)
// 默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  searchParam: () => ({})
});

// 获取响应式设置
const getResponsive = (item: ColumnProps) => {
  return {
    span: item.search?.span,
    offset: item.search?.offset ?? 0,
    xs: item.search?.xs,
    sm: item.search?.sm,
    md: item.search?.md,
    lg: item.search?.lg,
    xl: item.search?.xl
  };
};

// 是否默认折叠搜索项
const collapsed = ref(true);

// 获取响应式断点
const gridRef = ref();
const breakPoint = computed<BreakPoint>(() => gridRef.value?.breakPoint);

// 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
  let show = false;
  props.columns.reduce((prev, current) => {
    prev +=
      (current.search![breakPoint.value]?.span ?? current.search?.span ?? 1) +
      (current.search![breakPoint.value]?.offset ?? current.search?.offset ?? 0);
    if (typeof props.searchCol !== "number") {
      if (prev >= props.searchCol[breakPoint.value]) show = true;
    } else {
      if (prev >= props.searchCol) show = true;
    }
    return prev;
  }, 0);
  return show;
});
</script>
