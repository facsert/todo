"use client"

import { useState, useEffect } from 'react';
import { 
  Command,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandShortcut
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Trash2, PenLine  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner"

class Task {
  constructor(
    public id: Date = new Date(),
    public title: string = "",
    public content: string = "",
    public done: boolean = false,
  ) {}
}

type Filter = 'all' | 'done' | 'undone'

export default function Home() {
  const maxPageNum = 5
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  
  const [onAddTaskId, setOnAddTaskId] = useState<Date|null>(null);
  const [editTask, setEditTask] = useState<Task>(new Task());
  const [open, setOpen] = useState(false)

  const [pageNum, setPageNum] = useState(1)
  
  useEffect(() => {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      setTasks(JSON.parse(tasks));
    }
  }, []);

  const switchTask = (id: Date) => {
    const newTasks =tasks.map(task => task.id === id? {...task, done: !task.done} : task)
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  }

  const addTask = (formData: FormData) => {
    const newTask = {
      id: new Date(),
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      done: false
    }
    if (onAddTaskId === null) {
      setTasks([...tasks, newTask]);
      toast.success('添加成功');
    } else {
      setTasks(tasks.map(task => task.id === onAddTaskId? newTask: task));
      toast.success('修改成功');
    }
    setOnAddTaskId(newTask.id);
  }

  const deleteTask = (id: Date) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    if (selectTasks(newTasks).length === 0) {
      setPageNum(pageNum === 1? 1: pageNum - 1)
    }
  }

  const onSave = () => {
    setTasks(tasks.map(task => task.id === editTask.id? {...task, ...editTask} : task))
    toast.success('修改成功');
  }
  
  const selectTaskLength = () => {
    const num = tasks.filter(task => filter === 'all' || (filter === 'done' && task.done) || (filter === 'undone' && !task.done)).length
    return Math.ceil(num / maxPageNum)
  }
  
  const selectTasks = (taskList: Task[] = tasks) => {
    return taskList.filter(task => filter === 'all' || (filter === 'done' && task.done) || (filter === 'undone' && !task.done)).slice((pageNum - 1) * maxPageNum, pageNum * maxPageNum)
  }

  return (
    <div className="w-1/2 flex-col justify-center min-w-[50vw]">

      <div className='grid place-items-center mb-4'>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          TODO LIST
        </h1>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {tasks.filter(task => !task.done).length}/{tasks.length}
        </h1>
      </div>

      <ToggleGroup type='single' size="lg" className='w-full grid grid-cols-3 gap-0 px-auto'>
        <ToggleGroupItem value="all" onClick={() => setFilter('all')}>全部</ToggleGroupItem>
        <ToggleGroupItem value="done" onClick={() => setFilter('done')} >完成</ToggleGroupItem>
        <ToggleGroupItem value="undone" onClick={() => setFilter('undone')}>未完成</ToggleGroupItem>
      </ToggleGroup>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className='w-full mt-4 mb-4'>添加任务</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>添加任务</DialogTitle>
          <form action={addTask} className='flex flex-col gap-4'>
            <div>
              <Label>标题</Label>
              <Input name="title" />
            </div>
            <div>
              <Label>任务</Label>
              <Textarea name="content" className='h-[20vh]' />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <Button type="submit" variant="outline">添加</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => setOnAddTaskId(null)}>关闭</Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={open}
        onOpenChange={() => {setOpen(false)}}
      >
        <DialogContent>
          <DialogTitle>编辑任务</DialogTitle>
          <form action={onSave} className='flex flex-col gap-4'>
            <div>
              <Label>标题</Label>
              <Input
                name="title"
                defaultValue={editTask.title}
                value={editTask.title}
                onChange={(e) => setEditTask({...editTask, title: e.target.value})}
              />
            </div>
            <div>
              <Label>任务</Label>
              <Textarea
                name="content"
                className='h-[20vh]'
                defaultValue={editTask.content}
                value={editTask.content} 
                onChange={(e) => setEditTask({...editTask, content: e.target.value})} 
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <Button type="submit" variant="outline">保存</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">关闭</Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <Command className='flex flex-col border'>
        <CommandInput placeholder="搜索任务" />
        <CommandList>
          <CommandEmpty>未找到匹配任务</CommandEmpty>
          {selectTasks().map((task, index) => (
            <CommandItem key={index}>
              <Checkbox className="ml-2 mr-2" checked={task.done} onCheckedChange={() => {switchTask(task.id)}} />  
              <Label className={task.done? "line-through": ""}>
                {task.title}
              </Label>
              <CommandShortcut className="h-full flex flex-row items-center gap-0">
                <Button variant="ghost" onClick={() => {setEditTask(task) ;setOpen(true)}}>
                  <PenLine className="mr-2 h-6 w-6" />
                </Button>
                <Button variant="ghost" onClick={() => deleteTask(task.id)}>
                  <Trash2 className="h-6 w-6" />
                </Button>
              </CommandShortcut>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
      
      <Pagination className='mt-4'>
        <PaginationContent>
          {Array.from({ length: selectTaskLength() },  (_, i) => i + 1).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink href='#' className='border rounded-md' onClick={() => setPageNum(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
    </div>
  );
}




