<template>
  <div class="zlFormV2" v-if="props.visible">
    <el-dialog
      v-model="props.visible"
      destroy-on-close
      :close-on-press-escape="props.canEsc"
      :title="props?.zlvalue?.title"
      :close-on-click-modal="false"
      :width="props.width"
      :before-close="closeDialog"
    >
      <!-- 表单数据 -->
      <slot name="body-top"></slot>
      <div class="zlFormV2_body_box">
        <el-form inline ref="formRef" :rules="form.rules" label-position="right" :label-width="`${props.labelWidth}`" :model="form.formData.formData">
          <el-row :gutter="props.rowGutter">
            <el-col
              :span="rowValue.span || 12"
              v-for="(rowValue, rowKey) in form.formData.columns"
              :key="rowKey"
              :class="{ hidden: rowValue.hidden || rowKey.toString() == 'tabName' }"
            >
              <!-- 插槽 -->
              <div v-if="rowValue.type == 'spanSlot' && !rowValue.hidden" v-show="!rowValue.unShow" style="width: 100%">
                <slot :name="rowValue.slot" :item="form.formData"></slot>
              </div>
              <!-- 插槽item -->
              <el-form-item
                v-if="rowValue.type == 'slot' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;`"
                :prop="rowKey + ''"
              >
                <slot :name="rowValue.slot" :item="form.formData"></slot>
              </el-form-item>

              <!-- 众链Title -->
              <ZlTitle padding="12px 20px" style="margin: 12px 0" v-if="rowValue.type == 'title' && !rowValue.hidden" v-show="!rowValue.unShow">
                {{ rowValue.title }}
                <ZlRemind v-if="rowValue.remindType" :type="rowValue.remindType" :id="rowValue.remindID"> {{ rowValue.remindContent }}</ZlRemind>
              </ZlTitle>
              <!-- 众链说明 -->
              <ZlRemind
                v-if="rowValue.type == 'remind' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :type="rowValue.remindType"
                :id="rowValue.remindID"
              >
                {{ rowValue.remindContent }}</ZlRemind
              >
              <!-- 收起/展开更多 -->
              <div
                v-if="rowValue.type == 'unfold' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :id="`${props.formID}unfold`"
                class="FormShowBox"
                @click="formItemChanged('unfold', 'change', rowValue, rowKey)"
              >
                <div class="FormShowWithin">
                  <div>{{ rowValue.title || '点击展开更多' }}</div>
                  <div class="FormShowWithinSvg">
                    <svg
                      t="1669106960689"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2637"
                      width="18"
                      height="18"
                    >
                      <path
                        d="M142.805333 265.173333A58.666667 58.666667 0 1 0 59.861333 348.16l410.666667 410.666667a58.666667 58.666667 0 0 0 82.944 0l410.666667-410.666667a58.666667 58.666667 0 1 0-82.944-82.986667L512 634.368 142.805333 265.173333z"
                        p-id="2638"
                        fill="#409EFF"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div
                v-if="rowValue.type == 'fold' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :id="`${props.formID}fold`"
                class="FormShowBox"
                @click="formItemChanged('fold', 'change', rowValue, rowKey)"
              >
                <div class="FormShowWithin">
                  <div>{{ rowValue.title || '收起' }}</div>
                  <div class="FormShowWithinSvg">
                    <svg
                      t="1669110190877"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="3291"
                      width="18"
                      height="18"
                    >
                      <path
                        d="M100.122 691.978c-15.357 16.61-14.341 42.524 2.269 57.881 16.444 15.204 42.007 14.36 57.418-1.775l0.464-0.493 353.583-382.434 350.769 381.698c15.154 16.49 40.7 17.727 57.372 2.898l0.502-0.454c16.49-15.154 17.728-40.7 2.899-57.372l-0.455-0.502-380.835-414.418c-16.033-17.447-43.431-17.662-59.743-0.613l-0.491 0.522-383.752 415.062z"
                        p-id="3292"
                        fill="#409EFF"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- 表单内容 -->
              <!-- input输入框 -->
              <el-form-item
                v-if="rowValue.type == 'input' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                :prop="rowKey + ''"
              >
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-input
                  v-if="!rowValue.unShowItem"
                  v-model="form.formData.formData[rowKey]"
                  :id="props.formID + rowKey"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                  @blur="(e: any) => formItemChanged(e, 'blur', rowValue, rowKey)"
                  :clearable="rowValue.clearable"
                  :placeholder="rowValue.placeholder || ''"
                  :disabled="rowValue.disabled"
                  :size="rowValue.size || 'default'"
                />
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- number数字输入框 -->
              <el-form-item
                v-if="rowValue.type == 'number' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :label-width="rowValue.labelWidth"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                :prop="rowKey + ''"
              >
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-input
                  v-if="!rowValue.unShowItem"
                  v-model="form.formData.formData[rowKey]"
                  type="number"
                  :id="props.formID + rowKey"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                  @blur="(e: any) => formItemChanged(e, 'blur', rowValue, rowKey)"
                  :clearable="rowValue.clearable"
                  :placeholder="rowValue.placeholder || ''"
                  :disabled="rowValue.disabled"
                  :size="rowValue.size || 'default'"
                />
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- number数字选择框 -->
              <el-form-item
                v-if="rowValue.type == 'numberCount' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                :prop="rowKey + ''"
              >
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-input-number
                  v-if="!rowValue.unShowItem"
                  v-model="form.formData.formData[rowKey]"
                  type="number"
                  :id="props.formID + rowKey"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                  @blur="(e: any) => formItemChanged(e, 'blur', rowValue, rowKey)"
                  :min="rowValue.min"
                  :max="rowValue.max"
                  :step="rowValue.step"
                  :disabled="rowValue.disabled"
                  :size="rowValue.size || 'default'"
                />
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- 密码输入框 -->
              <el-form-item
                v-if="rowValue.type == 'password' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                :prop="rowKey + ''"
              >
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-input
                  v-if="!rowValue.unShowItem"
                  v-model="form.formData.formData[rowKey]"
                  :type="loginPassIco[rowKey] ? 'text' : 'password'"
                  :id="props.formID + rowKey"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                  @blur="(e: any) => formItemChanged(e, 'blur', rowValue, rowKey)"
                  :clearable="rowValue.clearable"
                  :placeholder="rowValue.placeholder || ''"
                  :disabled="rowValue.disabled"
                  :size="rowValue.size || 'default'"
                  :prefix-icon="Lock"
                >
                  <template #append>
                    <div style="width: 100%; display: flex; align-items: center" @click="passwordChengd(rowKey)">
                      <el-icon v-if="loginPassIco[rowKey]"><Hide /></el-icon>
                      <el-icon v-else><View /></el-icon>
                    </div>
                  </template>
                </el-input>
                <input v-show="false" :name="rowValue.fileds" type="password" placeholder="密码" style="position: absolute; left: 9999999px" />
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- textarea文本域 -->
              <el-form-item
                v-if="rowValue.type == 'textarea' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                :prop="rowKey + ''"
              >
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-input
                  v-if="!rowValue.unShowItem"
                  v-model="form.formData.formData[rowKey]"
                  type="textarea"
                  input-style="inputstyle"
                  :id="props.formID + rowKey"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                  @blur="(e: any) => formItemChanged(e, 'blur', rowValue, rowKey)"
                  :rows="rowValue.rows || 3"
                  :autosize="rowValue.autosize || true"
                  :resize="rowValue.resize || 'none'"
                  :clearable="rowValue.clearable"
                  :placeholder="rowValue.placeholder || ''"
                  :disabled="rowValue.disabled"
                  :size="rowValue.size || 'default'"
                />
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- select下拉框 -->
              <el-form-item
                v-if="rowValue.type == 'select' && !rowValue.hightBorder && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                :prop="rowKey + ''"
              >
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-select
                  v-if="!rowValue.unShowItem"
                  v-model="form.formData.formData[rowKey]"
                  :id="props.formID + rowKey"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                  @clear="(e: any) => formItemChanged(e, 'blur', rowValue, rowKey)"
                  :placeholder="rowValue.placeholder || ''"
                  :size="rowValue.size || 'default'"
                  :disabled="rowValue.disabled"
                  :filterable="rowValue.filterable"
                  :multiple="rowValue.multiple"
                  :allow-create="rowValue.allowCreate"
                  default-first-option
                  :multiple-limit="rowValue.multipleLimit || 0"
                  :clearable="rowValue.clearable"
                >
                  <el-option v-for="(i, idx) in rowValue.options" :key="idx" :label="i.label" :value="i.value" />
                </el-select>
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ getSelectLabelByValue(rowValue.options, form.formData[rowKey]) || form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- select下拉框高亮专用 -->
              <div
                :class="{ hightBorder: !form.formData[rowKey] }"
                v-if="rowValue.type == 'select' && rowValue.hightBorder && !rowValue.hidden"
                v-show="!rowValue.unShow"
              >
                <el-form-item
                  :label="rowValue.title"
                  :id="props.formID + rowKey"
                  :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                  :prop="rowKey + ''"
                >
                  <div v-if="!form.formData[rowKey]" class="hightBorder_content warningColor">
                    <el-icon style="margin-right: 6px"><WarningFilled /></el-icon>{{ rowValue.hightBorder }}
                  </div>
                  <!-- 内部插槽 -->
                  <div v-if="rowValue.innerSlot"><slot :name="rowValue.innerSlot" :item="form.formData"></slot></div>
                  <!-- 同 -->
                  <div
                    v-if="rowValue.same"
                    class="theSame_box"
                    :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                  >
                    <ZlTag
                      :disabled="props.sameDisabled || rowValue.disabled"
                      :effect="setting.isIsDark ? 'dark' : 'light'"
                      tagType="button"
                      size="small"
                      @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                      >{{ rowValue.same.name }}</ZlTag
                    >
                  </div>
                  <el-select
                    v-if="!rowValue.unShowItem"
                    v-model="form.formData.formData[rowKey]"
                    @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                    @clear="(e: any) => formItemChanged(e, 'blur', rowValue, rowKey)"
                    :placeholder="rowValue.placeholder || ' '"
                    :size="rowValue.size || 'default'"
                    :disabled="rowValue.disabled"
                    :filterable="rowValue.filterable"
                    :multiple="rowValue.multiple"
                    :allow-create="rowValue.allowCreate"
                    default-first-option
                    :multiple-limit="rowValue.multipleLimit || 0"
                    :clearable="rowValue.clearable"
                  >
                    <el-option v-for="(i, idx) in rowValue.options" :key="idx" :label="i.label" :value="i.value" />
                  </el-select>
                  <span
                    v-if="rowValue.unShowItem"
                    style="padding: 0 11px; box-sizing: border-box"
                    :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                    >{{ getSelectLabelByValue(rowValue.options, form.formData[rowKey]) || form.formData[rowKey] || '--' }}</span
                  >
                </el-form-item>
              </div>

              <!-- picker天选择 -->
              <el-form-item
                v-if="rowValue.type == 'date' && !rowValue.hightBorder && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                :prop="rowKey + ''"
              >
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-date-picker
                  v-if="!rowValue.unShowItem"
                  value-format="YYYY/MM/DD"
                  :id="props.formID + rowKey"
                  @visible-change="openPickDate(rowKey.toString())"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                  v-model="form.formData.formData[rowKey]"
                  type="date"
                  :shortcuts="rowValue.shortcuts || []"
                  :placeholder="rowValue.placeholder || ''"
                  :size="rowValue.size || 'default'"
                  :disabled="rowValue.disabled"
                  :clearable="rowValue.clearable ? true : false"
                />
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- picker天选择高亮专用 -->
              <el-form-item
                :class="{ hightBorder: !form.formData[rowKey] }"
                style="position: relative"
                v-if="rowValue.type == 'date' && rowValue.hightBorder && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                :prop="rowKey + ''"
              >
                <div v-if="!form.formData[rowKey]" class="hightBorder_content warningColor">
                  <el-icon style="margin-right: 6px"><WarningFilled /></el-icon>{{ rowValue.hightBorder }}
                </div>
                <!-- 内部插槽 -->
                <div v-if="rowValue.innerSlot"><slot :name="rowValue.innerSlot" :item="form.formData"></slot></div>
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-date-picker
                  v-if="!rowValue.unShowItem"
                  value-format="YYYY/MM/DD"
                  :id="props.formID + rowKey"
                  @visible-change="openPickDate(rowKey.toString())"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                  v-model="form.formData.formData[rowKey]"
                  type="date"
                  :shortcuts="rowValue.shortcuts || []"
                  :placeholder="rowValue.placeholder || ''"
                  :size="rowValue.size || 'default'"
                  :disabled="rowValue.disabled"
                  :clearable="rowValue.clearable ? true : false"
                />
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- picker时分秒选择 -->
              <el-form-item
                v-if="rowValue.type == 'datetime' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                :prop="rowKey + ''"
              >
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-date-picker
                  v-if="!rowValue.unShowItem"
                  value-format="YYYY/MM/DD HH:mm:ss"
                  :id="props.formID + rowKey"
                  @visible-change="openPickDate(rowKey.toString())"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                  v-model="form.formData.formData[rowKey]"
                  type="datetime"
                  :shortcuts="rowValue.shortcuts || []"
                  :placeholder="rowValue.placeholder || ''"
                  :size="rowValue.size || 'default'"
                  :disabled="rowValue.disabled"
                  :clearable="rowValue.clearable ? true : false"
                />
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- picker月选择 -->
              <el-form-item
                v-if="rowValue.type == 'month' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                :prop="rowKey + ''"
              >
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-date-picker
                  v-if="!rowValue.unShowItem"
                  value-format="YYYY/MM"
                  :id="props.formID + rowKey"
                  @visible-change="openPickDate(rowKey.toString())"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                  v-model="form.formData.formData[rowKey]"
                  type="month"
                  :shortcuts="rowValue.shortcuts || []"
                  :placeholder="rowValue.placeholder || ''"
                  :size="rowValue.size || 'default'"
                  :disabled="rowValue.disabled"
                  :clearable="rowValue.clearable ? true : false"
                />
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- picker年选择 -->
              <el-form-item
                v-if="rowValue.type == 'year' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                :prop="rowKey + ''"
              >
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-date-picker
                  v-if="!rowValue.unShowItem"
                  value-format="YYYY"
                  :id="props.formID + rowKey"
                  @visible-change="openPickDate(rowKey.toString())"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                  v-model="form.formData.formData[rowKey]"
                  type="year"
                  :shortcuts="rowValue.shortcuts || []"
                  :placeholder="rowValue.placeholder || ''"
                  :size="rowValue.size || 'default'"
                  :disabled="rowValue.disabled"
                  :clearable="rowValue.clearable ? true : false"
                />
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- switch开关 -->
              <el-form-item
                v-if="rowValue.type == 'switch' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                :prop="rowKey + ''"
              >
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-switch
                  v-if="!rowValue.unShowItem"
                  v-model="form.formData.formData[rowKey]"
                  :id="props.formID + rowKey"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                  :size="rowValue.size || ''"
                  :active-color="rowValue.activeColor"
                  :active-text="rowValue.activeText"
                  :inactive-color="rowValue.inactiveColor"
                  :inactive-text="rowValue.inactiveText"
                />
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- 普通单选框 -->
              <el-form-item
                v-if="rowValue.type == 'el-radio' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;position: relative;`"
                :prop="rowKey + ''"
              >
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-radio-group
                  v-if="!rowValue.unShowItem"
                  v-model="form.formData.formData[rowKey]"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                >
                  <el-radio
                    :id="`${props.formID}${rowKey}${i.value || i}`"
                    v-for="(i, idx) in rowValue.options"
                    :key="idx"
                    :size="rowValue.size || 'default'"
                    :disabled="rowValue.disabled"
                    :label="i.label ? i.label : i"
                    >{{ i.value ? i.value : i }}</el-radio
                  >
                </el-radio-group>
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- 带边框单选按钮 -->
              <el-form-item
                v-if="rowValue.type == 'el-radio-border' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;border:none;position: relative;`"
                :prop="rowKey + ''"
              >
                <!-- 同 -->
                <div
                  v-if="rowValue.same"
                  class="theSame_box"
                  :style="`left: -${rowValue.title ? Number(props.labelWidth.split('px')[0]) + 50 : 50}px;`"
                >
                  <ZlTag
                    :disabled="props.sameDisabled || rowValue.disabled"
                    :effect="setting.isIsDark ? 'dark' : 'light'"
                    tagType="button"
                    size="small"
                    @click="bindSameClick(rowValue.same.value, rowValue, rowKey)"
                    >{{ rowValue.same.name }}</ZlTag
                  >
                </div>
                <el-radio-group
                  v-if="!rowValue.unShowItem"
                  @change="(e: any) => formItemChanged(e, 'change', rowValue, rowKey)"
                  v-model="form.formData.formData[rowKey]"
                >
                  <el-radio
                    :id="`${props.formID}${rowKey}${i.value || i}`"
                    style="margin-bottom: 12px"
                    border
                    v-for="(i, idx) in rowValue.options"
                    :key="idx"
                    :size="rowValue.size || 'default'"
                    :disabled="rowValue.disabled"
                    :label="i.value ? i.value : i"
                    >{{ i.label ? i.label : i }}</el-radio
                  >
                </el-radio-group>
                <span
                  v-if="rowValue.unShowItem"
                  style="padding: 0 11px; box-sizing: border-box"
                  :class="{ mainColor: form.formData[rowKey], cjColor: !form.formData[rowKey] }"
                  >{{ form.formData[rowKey] || '--' }}</span
                >
              </el-form-item>
              <!-- 省市区街道 -->
              <ZlPCAS
                v-if="rowValue.type == 'ZlPCAS' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :zlvalue="form.formData[rowKey]"
                :rowValue="rowValue"
                :formPadding="props.formPadding"
                :labelWidth="props.labelWidth"
                :span="rowValue.span"
                :rows="rowValue.rows"
                @change="formItemChanged"
              />
              <!-- ZlSingleUpload -->
              <el-form-item
                v-if="rowValue.type == 'ZlSingleUpload' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;`"
                :prop="rowKey + ''"
              >
                <ZlSingleUpload
                  :modelValue="form.formData[rowKey]"
                  :rowKey="props.formID + rowKey"
                  :placeholder="rowValue?.placeholder || ''"
                  :height="rowValue?.height || undefined"
                  :width="rowValue?.width || undefined"
                  :background="rowValue?.background || undefined"
                  :size="rowValue?.size || undefined"
                  :radius="rowValue?.radius || undefined"
                  :showDelete="rowValue?.showDelete"
                  :showPreview="rowValue?.showPreview"
                  :closeCompress="rowValue?.closeCompress"
                  :showHdCamera="rowValue?.showHdCamera"
                  :showTip="rowValue?.showTip"
                  :group="rowValue?.group"
                  :type="rowValue?.uploadType"
                  :ocr="rowValue?.ocr"
                  :fileSize="rowValue?.fileSize"
                  :fileType="rowValue?.fileType"
                  :disabled="rowValue?.disabled"
                  :thumbnail="rowValue?.thumbnail"
                  :showPermission="rowValue?.showPermission"
                  :savePermission="rowValue?.savePermission"
                  :key="Number(new Date()).toString"
                  @change="(e: any) => formItemChanged(e, 'ZlSingleUpload', rowValue, rowKey)"
                />
              </el-form-item>
              <!-- ZlSingleUploadList -->
              <el-form-item
                v-if="rowValue.type == 'ZlSingleUploadList' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :label-width="rowValue.labelWidth || props.labelWidth"
                style="position: relative"
                :style="`padding: 0 ${rowValue.paddingRight || props.formPadding} 0 ${
                  rowValue.paddingLeft || props.formPadding
                };box-sizing:border-box;width: 100%;`"
                :prop="rowKey + ''"
              >
                <ZlSingleUploadList
                  :modelValue="form.formData[rowKey]"
                  :class="{ itemPosition: rowValue.position }"
                  :rowKey="props.formID + rowKey"
                  :placeholder="rowValue?.placeholder || ''"
                  :height="rowValue?.height || undefined"
                  :width="rowValue?.width || undefined"
                  :background="rowValue?.background || undefined"
                  :size="rowValue?.size || undefined"
                  :radius="rowValue?.radius || undefined"
                  :showDelete="rowValue?.showDelete"
                  :showPreview="rowValue?.showPreview"
                  :closeCompress="rowValue?.closeCompress"
                  :showHdCamera="rowValue?.showHdCamera"
                  :group="rowValue?.group"
                  :type="rowValue?.uploadType"
                  :ocr="rowValue?.ocr"
                  :fileSize="rowValue?.fileSize"
                  :fileType="rowValue?.fileType"
                  :disabled="rowValue?.disabled"
                  :thumbnail="rowValue?.thumbnail"
                  :showPermission="rowValue?.showPermission"
                  :savePermission="rowValue?.savePermission"
                  :key="Number(new Date()).toString"
                  :initAddFile="rowValue?.initAddFile"
                  @change="(e: any) => formItemChanged(e, 'ZlSingleUpload', rowValue, rowKey)"
                />
              </el-form-item>
              <!-- ZlFileListUpload -->
              <el-form-item
                v-if="rowValue.type == 'ZlFileListUpload' && !rowValue.hidden"
                v-show="!rowValue.unShow"
                :label="rowValue.title"
                :style="`padding: 0 ${props.formPadding};box-sizing:border-box;width: 100%;`"
                :prop="rowKey + ''"
              >
                <ZlFileListUpload
                  v-if="props.visible"
                  v-model="form.formData.formData[rowKey]"
                  :rowKey="props.formID + rowKey"
                  :showDelete="rowValue?.showDelete"
                  :showPreview="rowValue?.showPreview"
                  :closeCompress="rowValue?.closeCompress"
                  :showHdCamera="rowValue?.showHdCamera ? true : false"
                  :showDownload="rowValue?.showDownload"
                  :group="rowValue?.group"
                  :type="rowValue?.uploadType"
                  :fileSize="rowValue?.fileSize"
                  :fileType="rowValue?.fileType"
                  :disabled="rowValue?.disabled"
                  :thumbnail="rowValue?.thumbnail"
                  :showPermission="rowValue?.showPermission"
                  :savePermission="rowValue?.savePermission"
                  :key="Number(new Date()).toString"
                  @change="(e: any) => formItemChanged(e, 'ZlFileListUpload', rowValue, rowKey)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <slot name="body-bottom"></slot>
      <!-- footer区域 -->
      <template #footer>
        <div class="zlFormV2_footer_box">
          <div class="zlFormV2_footer_box_l">
            <el-button
              v-if="props.showDelete"
              :id="`${props.formID}delete`"
              :v-permission="props.permission"
              :type="props.deleteColor ? props.deleteColor : 'danger'"
              @click="deleteClick"
              >{{ props.deleteContent }}</el-button
            >
            <slot name="footer-left" :form="form.formData"></slot>
          </div>
          <div class="zlFormV2_footer_box_r">
            <slot name="footer-right"></slot>
            <el-button
              type="info"
              :id="`${props.formID}close`"
              @click="closeDialog"
              style="background-color: #fff; color: #1e2024; border: 1px solid #e7eaf3"
              >{{ props.closeContent }}</el-button
            >
            <el-button
              v-if="props.showSubmit"
              :id="`${props.formID}submit`"
              :loading="form.loading"
              :disabled="props.submitDisabled"
              type="primary"
              @click="submitClick(formRef)"
              style="background-color: #2882e8"
              >{{ props.submitContent }}</el-button
            >
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
  
<script setup lang="ts">
/** #region ********************************************* 引入************************************************* */
// 公用
import { toRefs, reactive, ref, watch, onMounted, nextTick, computed } from 'vue';
import { Lock, Hide } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
// 组件
import { ZlTag, ZlRemind, ZlTitle, ZlSingleUpload, ZlSingleUploadList, ZlFileListUpload } from '../index';
// 方法
import * as Utils from '/@/utils';
// 其它
import useStore from '/@/store/store';
import variables from '/@/assets/styles/export.module.scss';
import { cloneDeep, debounce } from 'lodash';
/* #endregion */

/* #region ********************************************** 数据准备 ******************************************** */
// 全局变量
const { setting } = useStore();

// 传入
const props = defineProps({
  formID: { type: String, default: '' }, // 表单ID
  visible: { type: Boolean, default: false }, // 是否打开表格
  zlvalue: { type: Object, default: {} }, // 表格数据
  menuData: { type: Array, default: [] }, // 待切换的表格
  width: { type: Number, default: 500 }, // 表格宽度
  labelWidth: { type: String, default: '85px' }, // label的长度
  rowGutter: { type: Number, default: 24 }, // 行的宽度
  formPadding: { type: String, default: variables.formPadding }, // 表单行的Padding
  checkMenu: { type: Boolean, default: false },
  beforeLeave: {
    type: Function,
    default: async (e: any, form: any, err: any) => {
      return true;
    },
  },
  permission: { type: String, default: '' },
  showDelete: { type: Boolean, default: true }, // 是否展示删除按钮
  deleteContent: { type: String, default: '删除' }, // 删除按钮展示
  showSubmit: { type: Boolean, default: true }, // 是否显示提交
  deleteDetail: { type: String, default: '' }, // 删除确认框中间提示的内容
  deleteConfirm: { type: Boolean, default: true }, // 删除确认框中的确认位置内容
  canEsc: { type: Boolean, default: false }, // 是否能够通过ESC关闭
  submitContent: { type: String, default: '提交' }, // 提交按钮的内容
  submitDisabled: { type: Boolean, default: false }, // 提交按钮禁用
  closeContent: { type: String, default: '取消' }, // 提交按钮的内容
  change: { type: Boolean, default: false }, // 刷新
  sameDisabled: { type: Boolean, default: false }, // 同，禁用
  deleteColor: { type: String, default: '' },
});
// 传出
const emit = defineEmits(['close', 'change', 'submit', 'delete', 'checkMenu', 'changeMenu']);

// 表单ref
const formRef = ref<FormInstance>();

// 数据
const state = reactive({
  form: {
    title: props.zlvalue.title,
    loading: props.zlvalue.loading,
    formData: props.zlvalue.formData,
    columns: props.zlvalue.columns,
    rules: {} as FormRules,
    menuDataList: props.zlvalue.menuDataList,
    zltagShow: props.zlvalue.zltagShow,
  },
  toNextTick: true,
});
const {
  form,
  toNextTick,
  // manageRangeOption
} = toRefs(state);
/* #endregion */

/* #region ********************************************** 初始化 ********************************************** */
onMounted(() => {
  let columns = props.zlvalue.formData.columns;
  state.form.columns = columns;
  getRules(columns);
});

/** 监听表单columns
 *
 */
watch(
  () => props.zlvalue.formData.columns,
  (nl: any, ol: any) => {
    state.form.columns = nl;
    getRules(nl);
  }
);

/** 监听表单数据
 *
 */
watch(
  () => props.zlvalue.formData.formData,
  (nl: any, ol: any) => {
    state.form.formData.formData = {};
    state.form.formData.formData = nl;
  }
);

/** 监听loading
 *
 */
watch(
  () => props.zlvalue.loading,
  (nl: any, ol: any) => {
    state.form.loading = nl;
  }
);

// 监听刷新
watch(
  () => props.change,
  (nl: any, ol: any) => getRules(props.zlvalue.columns)
);

// const submitDisabledShow = computed(() => {
//     return props.
// })

/** 获取rules
 *
 */
const getRules = (formData: any) => {
  for (let rowKey in formData) {
    if (formData[rowKey].rule) {
      if (formData[rowKey].rule instanceof Array) {
        // 如果是写的数组的表单验证
        state.form.rules[rowKey] = formData[rowKey].rule;
      } else {
        // 如果是写的true
        state.form.rules[rowKey] = [{ required: true, message: formData[rowKey].placeholder || '请输入', trigger: 'blur' }];
      }
    } else {
      delete state.form.rules[rowKey];
    }
  }
  state.toNextTick = false;
  nextTick(() => (state.toNextTick = true));
};
/* #endregion */

/* #region ********************************************** 操作 ************************************************ */
// 点击same按钮
const bindSameClick = (value: string, rowValue: any, rowKey: any) => {
  if (props.sameDisabled || rowValue.disabled) return;
  state.form.formData[rowValue.field] = state.form.formData[value];
  formItemChanged(state.form.formData[value], 'change', rowValue, rowKey);
};

// 是否显示密码
const loginPassIco = ref({} as any);
const passwordChengd = (rowKey: any) => {
  loginPassIco.value[rowKey] = !loginPassIco.value[rowKey];
};

/** item内容改变
 *
 */
const formItemChanged = (e: any, type: string, rowValue: any, rowKey: any) => {
  console.log('e:', typeof e, 'type: ', type, 'rowValue: ', rowValue, 'rowKey: ', rowKey);
  if (rowValue.type == 'ZlSingleUpload') {
    state.form.formData[rowKey] = e.fileID;
    state.form.formData[rowKey + 'Path'] = e.filePath;
  }
  if (rowValue.type == 'ZlSingleUploadList') state.form.formData[rowKey] = e.fileIDs;
  if (rowValue.type == 'ZlFileListUpload') state.form.formData[rowKey] = e.fileIDs;
  if (rowValue.type == 'ZlPCAS' && type == 'change') state.form.formData[rowKey] = e;
  if (rowValue.type == 'number' && type == 'change') state.form.formData[rowKey] = Number(e);
  emit('change', e, type, rowValue, rowKey);
};

/** 提交按钮
 *
 */
const submitClick = Utils.debounce(async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        emit('submit', state.form.formData.formData);
      } else {
        console.log('error submit!', fields);
      }
    });
  } catch (error) {
    console.log('error', error);
  }
}, 500);

/** 删除
 *
 * @param id
 */
const deleteClick = Utils.debounce(() => {
  if (props.deleteConfirm) {
    ElMessageBox.confirm(`${props.deleteDetail}确认${props.deleteContent}吗?`, props.deleteContent, {
      confirmButtonText: props.deleteContent,
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
      confirmButtonClass: 'ExitConfirmButton',
    }).then(() => {
      emit('delete', state.form.formData);
    });
  } else {
    emit('delete', state.form.formData);
  }
}, 500);

// 显示公司名字
// const getCompanyName = (id: string) => {
//     let list = [...state.manageRangeOption]
//     let res = ''
//     if (list && list.length > 0) {
//         list.forEach((item: any) => {
//             if (item.value == id) res = item.label
//         })
//     }
//     return res
// }
// 改变公司
const manageRangeClick = (e: any, rowKey: any, disabled?: boolean) => {
  if (!disabled && e.tenantID + '' != state.form.formData[rowKey]) {
    state.form.formData[rowKey] = e.tenantID.toString();
    emit('change', e, 'change', state.form.columns[rowKey], rowKey);
  }
};

/** 关闭弹窗
 *
 */
const closeDialog = () => {
  emit('close', state.form.formData);
};

/** 切换tab
 *
 */
const changeMenu = async (e: any, formEl: FormInstance | undefined) => {
  let result: boolean = true;
  if (props.checkMenu) {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        result = result && (await props.beforeLeave(e, state.form.formData, fields));
        // emit('checkMenu', state.form.formData)
      } else {
        result = result && (await props.beforeLeave(e, state.form.formData, fields));
      }
    });
  }
  if (!result) return;

  let menu = state.form.menuDataList;
  for (let key in menu) {
    menu[key] = false;
    if (key == e) menu[key] = true;
  }
  emit('changeMenu', e);
  state.toNextTick = false;
  nextTick(() => {
    // 重新渲染el-form
    state.toNextTick = true;
  });
};

/** 点击时间选择器后聚焦
 *
 */
const openPickDate = (rowKey: string) => {
  // let textInput = document.getElementById(props.formID + rowKey)
  //     textInput?.focus()
};
/* #endregion */

/* #region ********************************************** 其它 ************************************************ */
// 内部方法暴露
defineExpose({
  // beforeLeave, // 切换tab前的判断
});

// 通过value获取select的label
const getSelectLabelByValue = (options: any, value: any) => {
  if (options && options.length && (value || typeof value == 'boolean')) {
    let info = options.find((item: any) => {
      return item.value == value;
    });
    if (info && info.label) return info.label;
  }
  return undefined;
};
/* #endregion */
</script>
  
  
  
<style lang="scss" scoped>
/*Dialog主题样式*/
.zlFormV2 {
  :deep(.el-dialog) {
    border-radius: 5px;
    // background: #262626 !important;
    background: #262626 !important;
    padding: 0;
  }

  :deep(.el-dialog__header) {
    background: $formTitleBg !important;
    margin-right: 0;
    border-radius: 5px 5px 0 0;
    padding: $formPadding;
    box-sizing: border-box;
    border-bottom: 1px solid #e7eaf3;
    .el-dialog__title {
      color: $mainFontColor !important;
    }
  }
  :deep(.el-dialog__headerbtn) {
    top: 15px;
    right: 15px;
    .el-dialog__close {
      font-size: 25px;
    }
  }
  .el-input.is-disabled .el-input__wrapper {
    background-color: none !important;
  }

  :deep(.el-tabs__item) {
    color: $cjFontColor;
  }

  :deep(.el-dialog__body) {
    background: $formBodyBg !important;
    padding: $formPadding 0 !important;
    padding: 0 !important;

    .el-form-item__label {
      color: $mainFontColor;
      font-weight: 400;
    }
    .hightBorder {
      position: relative;
      .el-input__wrapper {
        background: $inputBg;
        border: 1px solid #e6a23c;
        box-sizing: border-box;
        .el-input__inner {
          color: $mainFontColor;
        }
      }
      .hightBorder_content {
        position: absolute;
        top: -24px;
        left: 0px;
        display: flex;
        align-items: center;
      }
    }
    .el-input__wrapper {
      background: $inputBg;
      border: $inputBorder;
      // box-shadow: none;
      .el-input__inner {
        color: $mainFontColor;
      }
    }
    .el-select {
      width: 100% !important;
    }

    .el-select-v2__wrapper {
      background: $inputBg;
      // box-shadow: none;
      .el-input__inner {
        color: $mainFontColor;
      }
    }

    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100% !important;

      .el-input__wrapper {
        width: 100% !important;
        box-sizing: border-box;
      }
    }

    .el-input__wrapper:hover {
      //  background: pink;
      box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    }

    .el-input-group__append {
      // background: red;
      background-color: transparent;
      border: none;
      // box-shadow: none;
      position: absolute;
      right: 0;
    }

    .el-textarea__inner {
      background: $inputBg;
    }
    // textarea禁用的样式
    .el-textarea.is-disabled {
      background: $inputDisabled !important;
      .el-textarea__inner {
        background: $inputBg;
        // box-shadow: none ;
        &:hover {
          box-shadow: 0 0 0 1px #e4e7ed inset;
        }
      }
    }
    // input禁用
    .el-input.is-disabled .el-input__wrapper {
      background: $inputDisabled;
    }
  }

  :deep(.el-dialog__footer) {
    background: $formFooterBg;
    padding: $formPadding;
    box-sizing: border-box;
    border-radius: 0 0 5px 5px;
  }

  .zlFormV2_body_box {
    padding: $formPadding;
    box-sizing: border-box;
    width: 100%;
    height: auto;

    .hidden {
      height: 0 !important;
      visibility: hidden !important;
      display: none;
    }

    .inputstyle {
      background: red;
    }

    .range_box {
      width: 100%;
      padding-bottom: $mainPadding $mainPadding 0 $mainPadding;
      box-sizing: border-box;
      flex-wrap: wrap;
      display: flex;
      justify-content: start;
      position: relative;
      .range_disabled {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 999;
        position: absolute;
        background: rgba($color: #000000, $alpha: 0);
        cursor: not-allowed;
      }
    }
  }

  .zlFormV2_footer_box {
    display: flex;
    justify-content: space-between;

    .zlFormV2_footer_box_l {
      display: flex;
    }

    .zlFormV2_footer_box_r {
      display: flex;
    }
  }
}

//   本文区域
:deep(.el-textarea__inner) {
  background: $topBg;
  // box-shadow: none;
  color: $mainFontColor;
}
:deep(.is-bordered) {
  background: $inputDisabled;
  border: $inputBorder;
}
// same同 的盒子
.theSame_box {
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
}
:deep(.el-switch__label) {
  color: $cjFontColor !important;
}

// 打开收起
.FormShowBox {
  margin: 0 auto;
  width: calc(100% - 40px);
  height: 32px;
  background: pink;
  border: none;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  margin-bottom: 18px;
  cursor: pointer;
  .FormShowWithin {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .FormShowWithin > div:nth-child(1) {
    color: #409eff;
    font-weight: 600;
    margin-right: 6px;
  }
  .FormShowWithinSvg {
    animation: fly-1 0.6s ease-in-out infinite alternate;
  }
}
.FormShowBox:hover {
  opacity: 1;
  animation: opacity 0.3s ease-out;
  .FormShowWithinSvg {
    animation: none;
  }
}
@keyframes fly-1 {
  from {
    transform: translateY(0.1em);
  }
  to {
    transform: translateY(-0.1em);
  }
}

:deep(.el-select__wrapper) {
  background: $inputBg !important;
  // box-shadow: none;
}
:deep(.el-select__wrapper.is-disabled) {
  background: $inputDisabled !important;
}
:deep(.el-input__wrapper) {
  border: 0 !important;
}
</style>
  