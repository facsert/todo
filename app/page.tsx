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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  
  const [editTask, setEditTask] = useState<Task>(new Task());
  const [open, setOpen] = useState(false)
  
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
    setTasks([...tasks, {
      id: new Date(),
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      done: false
    }]);
    toast.success('添加成功');
  }

  const deleteTask = (id: Date) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  }

  const onSave = () => {
    setTasks(tasks.map(task => task.id === editTask.id? {...task, ...editTask} : task))
    toast.success('修改成功');
  }

  return (
    <div className="w-1/2 flex-col justify-center">

      <div className='grid place-items-center mb-8'>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          TODO LIST ({tasks.filter(task => !task.done).length}/{tasks.length})
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
                <Button type="button" variant="outline">关闭</Button>
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

      <Command className='flex flex-col gap-2'>
        <CommandInput placeholder="搜索任务" />
        <CommandList>
          <CommandEmpty>未找到匹配任务</CommandEmpty>
          {tasks.filter(task => filter === 'all' || (filter === 'done' && task.done) || (filter === 'undone' && !task.done)).map((task, index) => (
            <CommandItem key={index} className='mt-0'>
              <Checkbox className="mr-2" checked={task.done} onCheckedChange={() => {switchTask(task.id)}} />  
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

    </div>
  );
}




