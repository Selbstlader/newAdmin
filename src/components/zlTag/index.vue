 <template>
  <!-- 标签、按钮组件 -->
  <div class="zltag_box">
    <div v-if="getTagType == 'content'" class="zltag_row">
      <slot></slot>
    </div>
    <!-- 点模式 -->
    <div v-if="getTagType == 'dot'" class="zltag_row">
      <div class="zltag_dot" :style="`background-color: ${getColor};`"></div>
      <slot></slot>
    </div>
    <!-- 星星模式 -->
    <div v-if="getTagType == 'star'" class="zltag_row">
      <el-icon v-if="getTagType == 'star'" class="zltag_star" size="16px" :color="getColor">
        <StarFilled />
      </el-icon>
      <slot></slot>
    </div>
    <!-- 标签或按钮模式 -->
    <el-badge v-if="getTagType == 'tag' || getTagType == 'button'" :hidden="getBadge" :value="props.badgeValue" class="item">
      <div
        :class="{
          default: props.size == 'default' && !props.icon,
          defaultIcon: props.size == 'default' && props.icon,
          small: props.size == 'small' && !props.icon,
          smallIcon: props.size == 'small' && props.icon,
          mini: props.size == 'mini' && !props.icon,
          miniIcon: props.size == 'mini' && props.icon,
          searchButton: props.type == 'search' && props.effect == 'light' && !props.disabled,
          searchButtonHovert: getTagType == 'button' && props.type == 'search' && props.effect == 'light',

          success: props.type == 'success' && props.effect == 'dark' && !props.disabled,
          warning: props.type == 'warning' && props.effect == 'dark' && !props.disabled,
          danger: props.type == 'danger' && props.effect == 'dark' && !props.disabled,
          info: props.type == 'info' && props.effect == 'dark' && !props.disabled,
          primary: props.type == 'primary' && props.effect == 'dark' && !props.disabled,
          successDisabled: props.type == 'success' && props.effect == 'dark' && props.disabled,
          warningDisabled: props.type == 'warning' && props.effect == 'dark' && props.disabled,
          dangerDisabled: props.type == 'danger' && props.effect == 'dark' && props.disabled,
          infoDisabled: props.type == 'info' && props.effect == 'dark' && props.disabled,
          primaryDisabled: props.type == 'primary' && props.effect == 'dark' && props.disabled,
          primaryHover: getTagType == 'button' && props.type == 'primary' && props.effect == 'dark',
          warningHover: getTagType == 'button' && props.type == 'warning' && props.effect == 'dark',
          dangerHover: getTagType == 'button' && props.type == 'danger' && props.effect == 'dark',
          infoHover: getTagType == 'button' && props.type == 'info' && props.effect == 'dark',
          successHover: getTagType == 'button' && props.type == 'success' && props.effect == 'dark',
          primarySelect: getTagType == 'button' && props.type == 'primary' && props.effect == 'dark' && props.select,
          warningSelect: getTagType == 'button' && props.type == 'warning' && props.effect == 'dark' && props.select,
          dangerSelect: getTagType == 'button' && props.type == 'danger' && props.effect == 'dark' && props.select,
          infoSelect: getTagType == 'button' && props.type == 'info' && props.effect == 'dark' && props.select,
          successSelect: getTagType == 'button' && props.type == 'success' && props.effect == 'dark' && props.select,

          successLight: props.type == 'success' && props.effect == 'light' && !props.disabled,
          warningLight: props.type == 'warning' && props.effect == 'light' && !props.disabled,
          dangerLight: props.type == 'danger' && props.effect == 'light' && !props.disabled,
          infoLight: props.type == 'info' && props.effect == 'light' && !props.disabled,
          primaryLight: props.type == 'primary' && props.effect == 'light' && !props.disabled,
          successLightDisabled: props.type == 'success' && props.effect == 'light' && props.disabled,
          warningLightDisabled: props.type == 'warning' && props.effect == 'light' && props.disabled,
          dangerLightDisabled: props.type == 'danger' && props.effect == 'light' && props.disabled,
          infoLightDisabled: props.type == 'info' && props.effect == 'light' && props.disabled,
          primaryLightDisabled: props.type == 'primary' && props.effect == 'light' && props.disabled,
          primaryLightHover: getTagType == 'button' && props.type == 'primary' && props.effect == 'light',
          warningLightHover: getTagType == 'button' && props.type == 'warning' && props.effect == 'light',
          dangerLightHover: getTagType == 'button' && props.type == 'danger' && props.effect == 'light',
          infoLightHover: getTagType == 'button' && props.type == 'info' && props.effect == 'light',
          successLightHovert: getTagType == 'button' && props.type == 'success' && props.effect == 'light',
          round: props.round,
          disabled: props.disabled,
        }"
      >
        <div :class="{ tagSearchBox: true, disabled: props.disabled }">
          <slot></slot>
          <span v-if="getValue" class="tagSearchBox_value">{{ props.badgeValue }}</span>
        </div>
      </div>
    </el-badge>
    <!-- 卡片模式 -->
    <el-badge v-if="getTagType == 'tagCard'" :hidden="getBadge" :value="props.badgeValue" class="item">
      <div
        :style="`background-color: ${getColor}`"
        :class="{
          border: true,
          default: props.size == 'default',
          small: props.size == 'small',
          round: props.round,
        }"
      >
        <slot></slot>
      </div>
      <!-- 快捷搜索模式 -->
      <div
        v-if="getTagType == 'tagSearch'"
        :class="{
          default: props.size == 'default',
          small: props.size == 'small',
          mini: props.size == 'mini',
          success: props.type == 'success',
          warning: props.type == 'warning',
          danger: props.type == 'danger',
          info: props.type == 'info',
          primary: props.type == 'primary',
          round: props.round,
        }"
      >
        <div class="tagSearchBox">
          <slot></slot>
          <span v-if="getValue" class="tagSearchBox_value">{{ props.badgeValue }}</span>
        </div>
      </div>
    </el-badge>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import variables from '/@/assets/styles/export.module.scss';
import { appDefaultConfig } from '/@/config/app-config';
const props = defineProps({
  tagType: {
    // 类型
    type: String,
    default: () => 'dot',
  },
  type: {
    // 颜色类型
    type: String,
    default: () => 'primary',
  },
  color: {
    // 颜色
    type: String,
    default: () => '',
  },
  round: {
    // 是否圆角
    type: Boolean,
    default: () => false,
  },
  select: {
    // 是否选择模式
    type: Boolean,
    default: () => false,
  },
  size: {
    // 大小
    type: String,
    default: () => 'default',
  },
  badgeValue: {
    // 气泡值
    type: Number,
    default: () => 0,
  },
  showBadge: {
    // 是否显示气泡
    type: Boolean,
    default: () => false,
  },
  showValue: {
    // 是否显示内部的气泡数字
    type: Boolean,
    default: () => false,
  },
  showZero: {
    // 是否显示0
    type: Boolean,
    default: () => false,
  },
  effect: {
    // 颜色模式
    type: String,
    default: () => 'dark',
  },
  disabled: {
    // 是否禁用
    type: Boolean,
    default: () => false,
  },
  icon: {
    // 图标
    type: Boolean,
    default: () => false,
  },
});

// 默认颜色
const colors: any = {
  primary: appDefaultConfig.primary,
  success: appDefaultConfig.success,
  warning: appDefaultConfig.warning,
  danger: appDefaultConfig.danger,
  info: appDefaultConfig.info,
};

// 设置显示气泡
const getBadge = computed<any>(() => {
  let res = false;
  if (props.showBadge) {
    // 显示气泡，将Hidden设为false
    if (props.badgeValue > 0) {
      res = true;
    } else if (props.showZero) {
      res = true;
    }
  } else {
    res = false;
  }
  return !res;
});

// 设置后面的数字
const getValue = computed<any>(() => {
  let res = false;
  if (props.showValue) {
    // 显示气泡，将Hidden设为false
    if (props.badgeValue > 0) {
      res = true;
    } else if (props.showZero) {
      res = true;
    }
  } else {
    res = false;
  }
  return res;
});

// 设置颜色
const getColor = computed<any>(() => {
  let type = props.type ? props.type : 'primary';
  if (props.color) return props.color;
  if (variables[type]) return variables[type];
  return colors[type];
});

// 设置标签类型
const getTagType = computed<any>(() => {
  return props.tagType ? props.tagType : 'dot';
});

// 获取大小
const getSize = computed<any>(() => {
  let size = 'default';
  if (props.size == 'small') size = 'small';
  return size;
});
</script>
<style lang="scss" scoped>
.zltag_box {
  height: 100%;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  .zltag_row {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .zltag_dot {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 5px;
  }

  .zltag_star {
    margin-right: 5px;
  }
}

.searchSelect {
  cursor: pointer;
  color: #fff;
  // background: $zlTagHoverColor_primary;
}
.primary {
  // color: $zlTagColor_primary;
  // background: $zlTagBgColor_primary;
  // border-color: $zlTagBdColor_primary;
}

.primarySelect {
  cursor: pointer;
  color: #fff;
  // background: $zlTagHoverColor_primary;
}

.primaryHover:hover {
  cursor: pointer;
  color: #fff;
  // background: $zlTagHoverColor_primary;
}

.success {
  // color: $zlTagColor_success;
  // background: $zlTagBgColor_success;
  // border-color: $zlTagBdColor_success;
}

.successSelect {
  cursor: pointer;
  color: #fff;
  // background: $zlTagHoverColor_success;
}

.successHover:hover {
  cursor: pointer;
  color: #fff;
  // background: $zlTagHoverColor_success;
}

.warning {
  // color: $zlTagColor_warning;
  // background: $zlTagBgColor_warning;
  // border-color: $zlTagBdColor_warning;
}

.warningSelect {
  cursor: pointer;
  color: #fff;
  // background: $zlTagHoverColor_warning;
}

.warningHover:hover {
  cursor: pointer;
  color: #fff;
  // background: $zlTagHoverColor_warning;
}

.danger {
  // color: $zlTagColor_danger;
  // background: $zlTagBgColor_danger;
  // border-color: $zlTagBdColor_danger;
}

.dangerSelect {
  cursor: pointer;
  color: #fff;
  // background: $zlTagHoverColor_danger;
}

.dangerHover:hover {
  cursor: pointer;
  color: #fff;
  // background: $zlTagHoverColor_danger;
}

// .info {
//   // color: $zlTagColor_info;
//   // background: $zlTagBgColor_info;
//   background: none;
//   // border-color: $zlTagBdColor_info;
// }

.infoSelect {
  cursor: pointer;
  color: #fff;
  // background: $zlTagHoverColor_info;
}

.infoHover:hover {
  cursor: pointer;
  color: #fff;
  // background: $zlTagHoverColor_info;
}

.default {
  height: 36px;
  padding: 8px 15px;
  width: fit-content;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
  line-height: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.defaultIcon {
  height: 36px;
  padding: 8px 8px;
  width: fit-content;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
  line-height: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.small {
  height: 32px;
  padding: 5px 11px;
  width: fit-content;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
  line-height: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.smallIcon {
  height: 32px;
  padding: 5px 5px;
  width: fit-content;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
  line-height: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.mini {
  height: 28px;
  padding: 3px 6px;
  width: fit-content;
  border-style: solid;
  border-radius: 3px;
  box-sizing: border-box;
  line-height: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border: none;
}

.miniIcon {
  height: 28px;
  padding: 3px 3px;
  width: fit-content;
  border-style: solid;
  border-radius: 3px;
  box-sizing: border-box;
  line-height: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border: none;
}

.round {
  border-radius: 12px;
}

.border {
  border: none;
}

.tagSearchBox {
  display: flex;
  align-items: center;
  white-space: nowrap;

  .tagSearchBox_value {
    padding-left: 6px;
    padding-top: 2px;
    box-sizing: border-box;
    color: #ff8f1f;
  }
}

.successLight {
  background: #67c23a;
  border: #67c23a;
  color: #fff;
}

.primaryLight {
  background: #2882e8;
  border: #2882e8;
  color: #fff;
}

.dangerLight {
  background: #f56c6c;
  border: #f56c6c;
  color: #fff;
}

.warningLight {
  background: #e6a23c;
  border: #e6a23c;
  color: #fff;
}

.infoLight {
  background: #909399;
  border: #909399;
  color: #fff;
}
.info {
  border: 1px solid #c7ccd6;
  background: #fff;
  color: #8c98a4;
}
.info::hov {
  border: 1px solid #c7ccd6;
  background: #fff;
  color: #8c98a4;
}
.successLightDisabled {
  background: #3e6b27;
  border: #3e6b27;
  color: rgba(255, 255, 255, 0.5);
}

.successDisabled {
  background: #1c2518;
  border: #1c2518;
  color: #3e6b27;
}

.primaryLightDisabled {
  background: #2a598a;
  border: #2a598a;
  color: rgba(255, 255, 255, 0.5);
}

.primaryDisabled {
  background: #18222c;
  border: #1d3043;
  color: #2a598a;
}

.dangerLightDisabled {
  background: #854040;
  border: #854040;
  color: rgba(255, 255, 255, 0.5);
}

.dangerDisabled {
  background: #2b1d1d;
  border: #412626;
  color: #854040;
}

.warningLightDisabled {
  background: #7d5b28;
  border: #7d5b28;
  color: rgba(255, 255, 255, 0.5);
}

.warningDisabled {
  background: #292218;
  border: #3e301c;
  color: #7d5b28;
}

.infoLightDisabled {
  background: #525457;
  border: #525457;
  color: rgba(255, 255, 255, 0.5);
}

.infoDisabled {
  background: #202121;
  border: #2d2d2f;
  color: #525457;
}

.searchButtonHovert:hover {
  cursor: pointer;
  opacity: 50%;
}

.successLightHover:hover {
  cursor: pointer;
  background: #4e8e2f;
}

.primaryLightHover:hover {
  cursor: pointer;
  background: #3375b9;
}

.dangerLightHover:hover {
  cursor: pointer;
  background: #b25252;
}

.warningLightHover:hover {
  cursor: pointer;
  background: #a77730;
}

.infoLightHover:hover {
  cursor: pointer;
  background: #6b6d71;
  color: #6b6d71;
}

:deep(.el-badge__content.is-fixed) {
  right: calc(12px + var(--el-badge-size) / 2);
  z-index: 99;
}

.disabled {
  cursor: not-allowed;
}
</style>
