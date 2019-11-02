<template>
  <div class="app-container" >
    <el-table id="listTable" v-if="listOrgViewVisible" v-loading="loading" :data="list"  row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="90px" label="Name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="60px" label="Members">
        <template slot-scope="scope">
          <span>{{ scope.row.members }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="Description">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="Slogan">
        <template slot-scope="scope">
          <span>{{ scope.row.slogan }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">
            {{ $t('table.publish') }}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">
            {{ $t('table.draft') }}
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-form v-if="createOrgViewVisible" v-loading="loading" inline-message :model="createOrgForm" :rules="createOrgRules" ref="createOrgForm">
      <el-form-item prop="name">
        <el-input status-icon prefix-icon="fa fa-user" v-model="createOrgForm.name"
                  placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="description">
        <el-input status-icon prefix-icon="fa fa-user" v-model="createOrgForm.description"
                  placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item prop="slogan">
        <el-input prefix-icon="fa fa-user" v-model="createOrgForm.slogan"
                  placeholder="口号" auto-complete="on">
        </el-input>
      </el-form-item>
      <el-form-item prop="logo">
        <el-input prefix-icon="fa fa-user" v-model="createOrgForm.logo" @keyup.enter.native="createOrgHandler"
                  placeholder="logo" auto-complete="on">
        </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" :loading="loading" @click.native.prevent="createOrgHandler">创建
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { fetchRoot, createRoot, fetchList } from '@/api/organization'


const orgEntity = {
  name: '',
  description: '',
  slogan: '',
  logo: ''
}

export default {
  name: 'Organization',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listOrgViewVisible:false,
      createOrgViewVisible:false,
      list: null,
      total: null,
      loading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status: 0
      },
      sortable: null,
      oldList: [],
      newList: [],
      createOrgForm: Object.assign({}, orgEntity),
      createOrgRules: {
        name: [{required: true, message: '名称不能为空', trigger: 'blur'},
          {min: 2, max: 8, message: '最小2个字，最大8个字', trigger: 'blur'}],
        description: [{required: false, message: '请输入描述', trigger: 'blur'},
          {min: 1, max: 320, message: '1~120个字', trigger: 'blur'}],
        slogan: [{required: false, message: '请输入口号', trigger: 'blur'},
          {min: 1, max: 32, message: '1~32个字', trigger: 'blur'}],
        logo: [{required: false, message: '请上传logo', trigger: 'blur'}]
      },
    }
  },
  created() {
    this.requestRoot()
  },
  methods: {
    async requestRoot() {
      this.loading = true
      const data = await fetchRoot()
      if(data.meta.code == 404) {
        this.createOrgViewVisible = true;
          this.loading = false;
      } else {
        this.createOrgViewVisible = false;
        this.listOrgViewVisible = true
        this.requestList();
      }
      console.log("fetchRoot "+ JSON.stringify(data))
    },
    async requestList() {
      this.loading = true
      const data = await fetchList(this.listQuery)
      this.list = data.data.org
      this.total = 100
      this.loading = false
      this.oldList = this.list.map(v => v.id)
      this.newList = this.oldList.slice()
    },

    createOrgHandler(){
      this.$refs.createOrgForm.validate(valid => {
        console.log(valid)
        if (valid) {
          this.loading = true
          createRoot({"name":this.createOrgForm.name,"description":this.createOrgForm.description,"slogan":this.createOrgForm.slogan,"logo":this.createOrgForm.logo}).then(data => {
            if (data.meta.code == 200){
              this.$message.info(data.meta.message);
              this.createOrgViewVisible = false;
              this.listOrgViewVisible = true
              this.requestList();
            } else {
              this.$message.error(data.meta.message);
            }
            this.loading = false
          });

        } else {
          this.$message.error("验证失败");
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
