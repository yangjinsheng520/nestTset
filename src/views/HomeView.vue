<template>
  <div class="wraps">
    <div>
      <el-input v-model="search.keyWord" style="width: 300px"></el-input>
      <el-button @click="init" style="margin-left: 10px">搜索</el-button>
      <el-button @click="openDialog" type="primary" style="margin-left: 10px"
        >添加</el-button
      >
    </div>
    <el-table border :data="tableData" style="width: 100%; margin-top: 30px">
      <el-table-column prop="name" label="名字" />
      <el-table-column prop="desc" label="描述" />
      <el-table-column prop="id" label="id" />
      <el-table-column>
        <template #default="scope">
          <el-button @click="edit(scope.row)">编辑</el-button>
          <el-button @click="deleteRow(scope.row)">删除</el-button>
          <el-button @click="openTagDialog(scope.row)">添加标签</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="changeSize"
      style="float: right; margin-top: 10px"
      background
      layout="prev, pager, next"
      :total="total"
    />
  </div>

  <el-dialog v-model="dialogVisible" title="弹框" width="50%">
    <el-form :model="form">
      <el-form-item prop="name" label="名称">
        <el-input v-model="form.name" placeholder="名称" />
      </el-form-item>
      <el-form-item prop="desc" label="描述">
        <el-input v-model="form.desc" placeholder="描述"> </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">关闭</el-button>
        <el-button type="primary" @click="save"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="isShowTag" title="添加tag">
    <el-select style="width: 100%" v-model="tags" multiple>
      <el-option value="tag1">tag1</el-option>
      <el-option value="tag2">tag2</el-option>
      <el-option value="tag3">tag3</el-option>
    </el-select>
    <template #footer>
      <el-button @click="addTa" type="primary">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance } from "element-plus";
import {
  addUser,
  updateUser,
  delUser,
  getList,
  addTags,
} from "../server/request";
const total = ref<number>(0);
//搜索框
const search = reactive({
  keyWord: "",
  page: 1,
  pageSize: 10,
});
//表单
const form = reactive({
  name: "",
  desc: "",
  id: 0,
});
//清空数据
const resetForm = reactive({ ...form });
//表格数据
const tableData = ref([]);
//弹框开关
const dialogVisible = ref<boolean>(false);
const openDialog = () => {
  dialogVisible.value = true;
  Object.assign(form, resetForm);
};
//初始化表格数据
const init = async () => {
  const list = await getList(search);
  tableData.value = list?.data ?? [];
  total.value = list?.total ?? 0;
};
init();
const changeSize = (page: number) => {
  search.page = page;
  init();
};
//保存 和修改 表格数据
const save = async () => {
  if (form.id) {
    await updateUser(form);
  } else {
    await addUser(form);
  }

  close();
  init();
};
//删除表格数据
const deleteRow = async (row: any) => {
  await delUser({ id: row.id });
  init();
};
//获取 详情
const edit = (row: any) => {
  dialogVisible.value = true;
  Object.assign(form, row);
};
//关闭弹框
const close = () => {
  dialogVisible.value = false;
};

//添加标签

const isShowTag = ref<boolean>(false);
const tags = ref<string[]>([]);
const selectedTagId = ref<number>(0);
const openTagDialog = (row: any) => {
  isShowTag.value = true;
  selectedTagId.value = row.id;
};
const addTa = async () => {
  const res = await addTags({ tags: tags.value, userId: selectedTagId.value });
  isShowTag.value = false;
  selectedTagId.value = 0;
  tags.value = [];
};
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}

html,
body {
  background: #ccc;
}

.wraps {
  height: 100vh;
  padding: 30px;
}
</style>
