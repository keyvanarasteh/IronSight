// BPF C program — Aya ile derlenir
#include "vmlinux.h"
#include <bpf/bpf_helpers.h>

struct {
    __uint(type, BPF_MAP_TYPE_PERF_EVENT_ARRAY);
} events SEC(".maps");

struct mprotect_event {
    __u32 pid;
    __u64 addr;
    __u64 len;
    __u32 prot;
};

SEC("tracepoint/syscalls/sys_enter_mprotect")
int monitor_mprotect(struct trace_event_raw_sys_enter* ctx) {
    struct mprotect_event event = {};
    event.pid = bpf_get_current_pid_tgid() >> 32;
    event.addr = ctx->args[0];
    event.len = ctx->args[1];
    event.prot = ctx->args[2];
    bpf_perf_event_output(ctx, &events, BPF_F_CURRENT_CPU, &event, sizeof(event));
    return 0;
}
