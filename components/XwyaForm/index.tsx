'use client'
import { ReactNode } from 'react'
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
// import UploadFile from '@/components/UploadFile'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Button} from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

type FormItemTypeProps =  "input" | "select" | "radio" | "checkbox" | "switch" | "textarea" | "upload" | "date" | "range";
type FormContentProps = { placeholder?: string; startPlaceholder?: string; endPlaceholder?: string; options?: GlobalOptions[]; multiple?: boolean; accept?: string,type?:string }
type FormItemProps = {
  label: string;
  name: string;
};
export type FormItemsProps = {
  type: FormItemTypeProps;
  item: FormItemProps;
  content?: FormContentProps;
}
type XwyaFormProps = {
  labelWidth?: number
  labelAlign?: 'left' | 'right'
  row?: number
  items: FormItemsProps[]
  onFinish?: (values: any) => void
  form: any,
  layout?: "horizontal" | "vertical",
  children?:ReactNode
}
const getTypeFormItem = (data: any, field: any, labelWidth: number = 65, labelAlign: "left"|"right" = "right", layout: string) => {
  switch (data.type) {
    case 'input':
      return (
        <>
          <div className={cn(layout==="horizontal" && "flex"," gap-2 items-center") }>
            <FormLabel className='data-[error=true]:text-[var(--destructive)]' style={{ width: labelWidth, textAlign: labelAlign,flexShrink:0  }}>{data.item.label}</FormLabel>
            <FormControl className={cn(layout==="vertical" && "mt-1") }>
              <Input className=" focus-visible:ring-0 focus-visible:ring-none" {...data.content} {...field} />
            </FormControl>
          </div>
          {data.item.description && <FormDescription >{data.item.description} </FormDescription>}
          <FormMessage className='text-[var(--destructive)]' />
        </>
      )
    case 'textarea':
      return (
        <>
          <div className={cn(layout==="horizontal" && "flex"," gap-2 ") }>
            <FormLabel className='data-[error=true]:text-[var(--destructive)]' style={{ width: labelWidth, textAlign: labelAlign,flexShrink:0  }}>{data.item.label}</FormLabel>
            <FormControl className={cn(layout==="vertical" && "mt-1") }>
              <Textarea className="resize-none !outline-0" {...data.content} {...field} />
            </FormControl>
          </div>
          {data.item.description && <FormDescription>{data.item.description} </FormDescription>}
          <FormMessage className='text-[var(--destructive)]' />
        </>
      )
    case 'select':
      return (
        <>
          <div className={cn(layout==="horizontal" && "flex","gap-2 items-center") }>
            <FormLabel className='data-[error=true]:text-[var(--destructive)]' style={{ width: labelWidth, textAlign: labelAlign,flexShrink:0  }}>{data.item.label}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} >
              <FormControl className={cn(layout==="vertical" && "mt-1") }>
                <SelectTrigger className={`${field.value ? '' : 'text-muted-foreground'}`}>
                  <SelectValue {...data.content}  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data.content.options.map((item: any) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {data.item.description && <FormDescription>{data.item.description} </FormDescription>}
          <FormMessage className='text-[var(--destructive)]' />
        </>
      )
    case 'radio':
      return (
        <>
          <div className={cn(layout==="horizontal" && "flex"," gap-2 ") }>
            <FormLabel className='data-[error=true]:text-[var(--destructive)]' style={{ width: labelWidth, textAlign: labelAlign,flexShrink:0  }}>{data.item.label}</FormLabel>
            <FormControl className={cn(layout==="vertical" && "mt-1") }>
              <RadioGroup {...data.content} onValueChange={field.onChange} defaultValue={field.value}>
                <div className=" flex gap-2 items-center flex-wrap">
                  {data.content.options.map((item:GlobalOptions) => (
                    <div className="flex items-center space-x-2" key={item.value}>
                      <RadioGroupItem value={item.value} id={`${item.value}-radio`} />
                      <Label htmlFor={`${item.value}-radio`}>{item.label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </FormControl>
          </div>
          {data.item.description && <FormDescription>{data.item.description} </FormDescription>}
          <FormMessage className='text-[var(--destructive)]' />
        </>
      )
    case 'checkbox':
      return (
        <>
          <div className={cn(layout==="horizontal" && "flex","gap-2 ") }>
            <FormLabel className='data-[error=true]:text-[var(--destructive)]' style={{ width: labelWidth, textAlign: labelAlign,flexShrink:0  }}>{data.item.label}</FormLabel>
            <FormControl className={cn(layout==="vertical" && "mt-1") }>
              <div className=" flex gap-2 items-center flex-wrap">
                {data.content.options.map((item:GlobalOptions) => (
                  <div className="flex gap-2" key={item.value}>
                    <Checkbox
                      id={`${item.value}-checkbox`}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.value
                            ? field.onChange([...field.value, item.value])
                            : field.onChange([item.value])
                          : field.onChange(field.value?.filter((value:string|number) => value !== item.value))
                      }}
                      checked={field.value && field.value?.includes(item.value)}
                    />
                    <Label htmlFor={`${item.value}-checkbox`}>{item.label}</Label>
                  </div>
                ))}
              </div>
            </FormControl>
          </div>
          {data.item.description && <FormDescription>{data.item.description} </FormDescription>}
          <FormMessage className='text-[var(--destructive)]' />
        </>
      )
    case 'switch':
      return (
        <>
          <div className={cn(layout==="horizontal" && "flex","gap-2 items-center") }>
            <FormLabel className='data-[error=true]:text-[var(--destructive)]' style={{ width: labelWidth, textAlign: labelAlign,flexShrink:0 }}>{data.item.label}</FormLabel>
            <FormControl className={cn(layout === "vertical" && "mt-1")}>
              <div>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              </div>
            </FormControl>
          </div>
          {data.item.description && <FormDescription>{data.item.description} </FormDescription>}
          <FormMessage className='text-[var(--destructive)]' />
        </>
      )
    // case 'upload':
    //   return (
    //     <>
    //       <div className={cn(layout==="horizontal" && "flex","gap-2") }>
    //         <FormLabel style={{ width: labelWidth, textAlign: labelAlign,flexShrink:0}}>{data.item.label}</FormLabel>
    //         <FormControl>
    //           <UploadFile filelist={field.value} onChange={field.onChange} {...data.content} />
    //         </FormControl>
    //       </div>
    //       {data.item.description && <FormDescription>{data.item.description} </FormDescription>}
    //       <FormMessage />
    //     </>
    //   )
    case 'date':
      return (
        <>
          <div className={cn(layout==="horizontal" && "flex","gap-2 items-center") }>
            <FormLabel className='data-[error=true]:text-[var(--destructive)]' style={{ width: labelWidth, textAlign: labelAlign,flexShrink:0  }}>{data.item.label}</FormLabel>
            <FormControl className={cn(layout==="vertical" && "mt-1") }>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(' w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                  >
                    <span className="iconify solar--alarm-broken text-base"></span>
                    {field.value ? format(field.value, 'PPP', { locale: zhCN }) : <span>{data.content.placeholder}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
            </FormControl>
          </div>
          {data.item.description && <FormDescription>{data.item.description} </FormDescription>}
          <FormMessage className='text-[var(--destructive)]' />
        </>
      )
    case 'range':
      return (
        <>
          <div className={cn(layout==="horizontal" && "flex"," gap-2 items-center") }>
            <FormLabel className='data-[error=true]:text-[var(--destructive)]' style={{ width: labelWidth, textAlign: labelAlign,flexShrink:0  }}>{data.item.label}</FormLabel>
            <FormControl className={cn(layout==="vertical" && "mt-1") }>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                  >
                    <span className="iconify solar--alarm-broken text-base "></span>
                    <span className={ cn(field.value.from?'':'text-muted-foreground')}>{field.value.from? format(field.value.from, 'PPP', { locale: zhCN }) : <span>{data.content.startPlaceholder}</span>}</span> 
                    <span className={ cn('text-muted-foreground')}>-</span>
                    <span className={ cn(field.value.to?'':'text-muted-foreground')}>{field.value.to ? format(field.value.to, 'PPP', { locale: zhCN }) : <span>{data.content.endPlaceholder}</span>}</span> 
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value.from}
                    selected={field.value}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
          </div>
          {data.item.description && <FormDescription>{data.item.description} </FormDescription>}
          <FormMessage className='text-[var(--destructive)]' />
        </>
      )
  }
}

/**
 *  items 數組對象// 循環使用
 *  labelWidth 標籤寬度 默認100
 *  labelAlign 標籤對齊方式 默認left
 *  row 默認每行多少個
 */
const XwyaForm = ({ items = [], row = 1, layout = "vertical", labelAlign, labelWidth, onFinish, form, children }: XwyaFormProps) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // 阻止默认表单提交（页面刷新）
    e.stopPropagation();  // 阻止事件冒泡，防止外部表单提交
    form.handleSubmit(onFinish)();  // 手动提交内部表单
  }

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} autoComplete="off">
        <div className="flex  gap-4 flex-wrap items-center">
          {items.map((item, index:number) => (
            <FormField
              key={index}
              control={form.control}
              name={item.item.name}
              render={({ field }) => <FormItem style={{ width: `${100 / row}%` }} className={`${row!=1 && 'max-md:!w-full  max-lg:!w-[calc(50%-8px)] max-xl:!w-[calc(50%-8px)] max-2xl:!w-[calc(33%-8px)]'} ` }>{getTypeFormItem(item, field, labelWidth, labelAlign,layout)}</FormItem>}
            />
          ))}
          { children}
        </div>
      </form>
    </Form>
  )
}
export default XwyaForm
