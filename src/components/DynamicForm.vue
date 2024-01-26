<template>
    <div v-if="visible" class="dynamic-form">
      <v-card>
        <v-card-title>
          <span class="headline">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" v-for="field in fields" :key="field.name">
                <template v-if="field.input_type === 'text'">
                  <v-text-field
                    :label="field.label"
                    v-model="formData[field.name]"
                    required
                  ></v-text-field>
                </template>
                <template v-if="field.input_type === 'combo'">
                  <v-select
                    :items="field.values_list"
                    :label="field.label"
                    v-model="formData[field.name]"
                  ></v-select>
                </template>
                <!-- Добавьте другие типы input-элементов при необходимости -->
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="discard">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="submit">OK</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: String,
      fields: Array,
      visible: Boolean,
    },
    data() {
      return {
        formData: {},
      };
    },
    watch: {
      fields: {
        immediate: true,
        deep: true,
        handler(fields) {
          fields.forEach(field => {
            if (field.default_value !== undefined) {
              this.formData[field.name] = field.default_value;
            } else {
              this.formData[field.name] = null;
            }
          });
        }
      }
    },
    methods: {
      submit() {
        this.$emit('submit', this.formData);
      },
      discard() {
        // Сброс formData перед закрытием
        this.fields.forEach(field => {
          this.formData[field.name] = null;
        });
        this.$emit('update:visible', false);
        this.$emit('cancel');
      }
    }
  };
  </script>
  
  <style scoped>
  .dynamic-form {
  }
  </style>
  